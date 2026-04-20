const pool = require('../../db');
const fs = require('fs');
const path = require('path');

class PointsService {
  _formatPointDetails(row) {
    let details = {};
    if (row.food_details) details = row.food_details;
    else if (row.nature_details) details = row.nature_details;
    else if (row.accommodation_details) details = row.accommodation_details;
    else if (row.healthcare_details) details = row.healthcare_details;
    else if (row.education_details) details = row.education_details;

    if (details.point_id) delete details.point_id;

    const formatted = {
      ...row,
      details: {
        ...details,
        facility_list: row.facility_list || [],
        healthcare_type_list: row.healthcare_type_list || []
      },
    };

    delete formatted.food_details;
    delete formatted.nature_details;
    delete formatted.accommodation_details;
    delete formatted.healthcare_details;
    delete formatted.education_details;
    delete formatted.facility_list;
    delete formatted.healthcare_type_list;

    return formatted;
  }

  _deleteFile(fileUrl) {
    if (!fileUrl) return;
    try {
      // Expecting URL like /uploads/12345.jpg
      const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      const absolutePath = path.join(__dirname, '../../', relativePath);
      
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`Successfully deleted file: ${absolutePath}`);
      }
    } catch (err) {
      console.error(`Error deleting file ${fileUrl}:`, err);
    }
  }

  async getPointsByUser(userId) {
    const query = `
      SELECT p.*, t.name as type_name, t.icon_url as type_icon,
        c.name as cluster_name, t.cluster_id,
        row_to_json(cf.*) as food_details,
        row_to_json(cn.*) as nature_details,
        row_to_json(ca.*) as accommodation_details,
        row_to_json(ch.*) as healthcare_details,
        row_to_json(ce.*) as education_details,
        COALESCE(
          (SELECT json_agg(image_url) FROM object_images WHERE point_id = p.id), 
          '[]'::json
        ) as images,
        COALESCE(
          (SELECT json_agg(f.name) 
           FROM nature_facilities nf 
           JOIN facilities f ON nf.facility_id = f.id 
           WHERE nf.point_id = p.id),
          '[]'::json
        ) as facility_list,
        COALESCE(
          (SELECT json_agg(ht.name) 
           FROM healthcare_facilities_link hfl 
           JOIN healthcare_types ht ON hfl.healthcare_type_id = ht.id 
           WHERE hfl.point_id = p.id),
          '[]'::json
        ) as healthcare_type_list
      FROM object_points p
      JOIN types t ON p.type_id = t.id
      LEFT JOIN clusters c ON t.cluster_id = c.id
      LEFT JOIN cluster_foods cf ON p.id = cf.point_id
      LEFT JOIN cluster_natures cn ON p.id = cn.point_id
      LEFT JOIN cluster_accommodations ca ON p.id = ca.point_id
      LEFT JOIN cluster_healthcares ch ON p.id = ch.point_id
      LEFT JOIN cluster_educations ce ON p.id = ce.point_id
      WHERE p.created_by = $1
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map(this._formatPointDetails);
  }

  async getAllPoints() {
    const query = `
      SELECT p.*, t.name as type_name, t.icon_url as type_icon,
        c.name as cluster_name, t.cluster_id,
        row_to_json(cf.*) as food_details,
        row_to_json(cn.*) as nature_details,
        row_to_json(ca.*) as accommodation_details,
        row_to_json(ch.*) as healthcare_details,
        row_to_json(ce.*) as education_details,
        COALESCE(
          (SELECT json_agg(image_url) FROM object_images WHERE point_id = p.id), 
          '[]'::json
        ) as images,
        COALESCE(
          (SELECT json_agg(f.name) 
           FROM nature_facilities nf 
           JOIN facilities f ON nf.facility_id = f.id 
           WHERE nf.point_id = p.id),
          '[]'::json
        ) as facility_list,
        COALESCE(
          (SELECT json_agg(ht.name) 
           FROM healthcare_facilities_link hfl 
           JOIN healthcare_types ht ON hfl.healthcare_type_id = ht.id 
           WHERE hfl.point_id = p.id),
          '[]'::json
        ) as healthcare_type_list
      FROM object_points p
      JOIN types t ON p.type_id = t.id
      LEFT JOIN clusters c ON t.cluster_id = c.id
      LEFT JOIN cluster_foods cf ON p.id = cf.point_id
      LEFT JOIN cluster_natures cn ON p.id = cn.point_id
      LEFT JOIN cluster_accommodations ca ON p.id = ca.point_id
      LEFT JOIN cluster_healthcares ch ON p.id = ch.point_id
      LEFT JOIN cluster_educations ce ON p.id = ce.point_id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows.map(this._formatPointDetails);
  }

  async addPoint({ name, description, address, latitude, longitude, type_id, created_by, tags, phone, status, image_urls, details, cluster_name }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const pointQuery = `
        INSERT INTO object_points 
        (name, description, address, latitude, longitude, type_id, created_by, tags, phone, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;
      const safeTags = JSON.stringify(tags || []);
      const pointValues = [name, description, address, latitude, longitude, type_id, created_by, safeTags, phone, status];
      
      const pointResult = await client.query(pointQuery, pointValues);
      const pointId = pointResult.rows[0].id;

      if (image_urls && image_urls.length > 0) {
        const imageQuery = `
          INSERT INTO object_images (point_id, image_url, is_primary)
          VALUES ($1, $2, $3)
        `;
        for (let i = 0; i < image_urls.length; i++) {
          await client.query(imageQuery, [pointId, image_urls[i], i === 0]);
        }
      }

      if (details && cluster_name) {
        await this._upsertClusterData(client, pointId, cluster_name, details);
      }

      await client.query('COMMIT');
      
      return { 
        id: pointId, 
        name, address, latitude, longitude, type_id, phone, status, 
        images: image_urls || [],
        details
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async updatePoint(id, { name, description, address, latitude, longitude, type_id, tags, phone, status, image_urls, details, cluster_name }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const pointQuery = `
        UPDATE object_points 
        SET name = $1, description = $2, address = $3, latitude = $4, 
            longitude = $5, type_id = $6, tags = $7, phone = $8, status = $9
        WHERE id = $10
        RETURNING *
      `;
      const safeTags = JSON.stringify(tags || []);
      const pointValues = [name, description, address, latitude, longitude, type_id, safeTags, phone, status, id];
      
      const pointResult = await client.query(pointQuery, pointValues);

      // Capture old images for physical deletion before DB update
      const oldImagesRes = await client.query('SELECT image_url FROM object_images WHERE point_id = $1', [id]);
      const oldImages = oldImagesRes.rows.map(r => r.image_url);

      const oldMenuImageRes = await client.query('SELECT menu_image_url FROM cluster_foods WHERE point_id = $1', [id]);
      const oldMenuImage = oldMenuImageRes.rows[0]?.menu_image_url;

      await client.query('DELETE FROM object_images WHERE point_id = $1', [id]);
      
      if (image_urls && image_urls.length > 0) {
        const imageQuery = `
          INSERT INTO object_images (point_id, image_url, is_primary)
          VALUES ($1, $2, $3)
        `;
        for (let i = 0; i < image_urls.length; i++) {
          await client.query(imageQuery, [id, image_urls[i], i === 0]);
        }
      }

      if (details && cluster_name) {
        await this._upsertClusterData(client, id, cluster_name, details);
      }

      // PHYSICAL FILE CLEANUP: Delete files that were in existing images but not in the new image_urls
      const oldImagesQuery = 'SELECT image_url FROM object_images WHERE point_id = $1';
      // Wait, we already deleted them in the DB at line 181. 
      // We should have captured them BEFORE deleting.
      // I will refactor the update logic slightly to capture old images.

      await client.query('COMMIT');

      // PHYSICAL FILE CLEANUP: After successful commit
      const newImages = image_urls || [];
      const imagesToDelete = oldImages.filter(url => !newImages.includes(url));
      imagesToDelete.forEach(url => this._deleteFile(url));

      if (oldMenuImage && details.menu_image_url !== oldMenuImage) {
        this._deleteFile(oldMenuImage);
      }

      return pointResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async _upsertClusterData(client, pointId, clusterName, details) {
    switch (clusterName) {
      case 'Restoran':
        await client.query(`
          INSERT INTO cluster_foods (point_id, signature_menu, price_min, price_max, opening_hours, open_time, close_time, menu_image_url, is_halal, has_wifi) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
          ON CONFLICT (point_id) DO UPDATE SET 
            signature_menu = EXCLUDED.signature_menu, 
            price_min = EXCLUDED.price_min, 
            price_max = EXCLUDED.price_max, 
            opening_hours = EXCLUDED.opening_hours,
            open_time = EXCLUDED.open_time,
            close_time = EXCLUDED.close_time,
            menu_image_url = EXCLUDED.menu_image_url,
            is_halal = EXCLUDED.is_halal, 
            has_wifi = EXCLUDED.has_wifi
        `, [pointId, details.signature_menu, details.price_min, details.price_max, details.opening_hours, details.open_time, details.close_time, details.menu_image_url, details.is_halal, details.has_wifi]);
        break;
      case 'Alam':
        await client.query(`
          INSERT INTO cluster_natures (point_id, elevation, difficulty_level, entry_fee_min, entry_fee_max, public_facilities) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          ON CONFLICT (point_id) DO UPDATE SET 
            elevation = EXCLUDED.elevation, 
            difficulty_level = EXCLUDED.difficulty_level, 
            entry_fee_min = EXCLUDED.entry_fee_min, 
            entry_fee_max = EXCLUDED.entry_fee_max, 
            public_facilities = EXCLUDED.public_facilities
        `, [pointId, details.elevation, details.difficulty_level, details.entry_fee_min, details.entry_fee_max, details.public_facilities]);
        
        // Sync Many-to-Many Facilities
        await client.query('DELETE FROM nature_facilities WHERE point_id = $1', [pointId]);
        if (details.facility_ids && Array.isArray(details.facility_ids)) {
          for (const fid of details.facility_ids) {
            await client.query('INSERT INTO nature_facilities (point_id, facility_id) VALUES ($1, $2)', [pointId, fid]);
          }
        }
        break;
      case 'Healthcare':
        await client.query(`
          INSERT INTO cluster_healthcares (point_id, facility_type, has_igd, accepts_bpjs, ambulance_available) 
          VALUES ($1, $2, $3, $4, $5) 
          ON CONFLICT (point_id) DO UPDATE SET 
            facility_type = EXCLUDED.facility_type, 
            has_igd = EXCLUDED.has_igd, 
            accepts_bpjs = EXCLUDED.accepts_bpjs, 
            ambulance_available = EXCLUDED.ambulance_available
        `, [pointId, details.facility_type, details.has_igd, details.accepts_bpjs, details.ambulance_available]);

        // Sync Many-to-Many Healthcare Types
        await client.query('DELETE FROM healthcare_facilities_link WHERE point_id = $1', [pointId]);
        if (details.healthcare_type_ids && Array.isArray(details.healthcare_type_ids)) {
          for (const htid of details.healthcare_type_ids) {
            await client.query('INSERT INTO healthcare_facilities_link (point_id, healthcare_type_id) VALUES ($1, $2)', [pointId, htid]);
          }
        }
        break;
      case 'Accommodation':
        await client.query(`
          INSERT INTO cluster_accommodations (point_id, star_rating, check_in_time, check_out_time, has_pool) 
          VALUES ($1, $2, $3, $4, $5) 
          ON CONFLICT (point_id) DO UPDATE SET 
            star_rating = EXCLUDED.star_rating, 
            check_in_time = EXCLUDED.check_in_time, 
            check_out_time = EXCLUDED.check_out_time, 
            has_pool = EXCLUDED.has_pool
        `, [pointId, details.star_rating, details.check_in_time, details.check_out_time, details.has_pool]);
        break;
      case 'Education':
        await client.query(`
          INSERT INTO cluster_educations (point_id, education_level, accreditation, school_status, has_library) 
          VALUES ($1, $2, $3, $4, $5) 
          ON CONFLICT (point_id) DO UPDATE SET 
            education_level = EXCLUDED.education_level, 
            accreditation = EXCLUDED.accreditation, 
            school_status = EXCLUDED.school_status, 
            has_library = EXCLUDED.has_library
        `, [pointId, details.education_level, details.accreditation, details.school_status, details.has_library]);
        break;
    }
  }

  async deletePoint(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Capture all images related to this point before deletion
      const imagesRes = await client.query('SELECT image_url FROM object_images WHERE point_id = $1', [id]);
      const images = imagesRes.rows.map(r => r.image_url);

      const menuImageRes = await client.query('SELECT menu_image_url FROM cluster_foods WHERE point_id = $1', [id]);
      const menuImage = menuImageRes.rows[0]?.menu_image_url;

      const deleteQuery = 'DELETE FROM object_points WHERE id = $1 RETURNING *';
      const { rows } = await client.query(deleteQuery, [id]);
      const deletedPoint = rows[0];

      await client.query('COMMIT');

      // Physical cleanup
      images.forEach(url => this._deleteFile(url));
      if (menuImage) this._deleteFile(menuImage);

      return deletedPoint;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new PointsService();