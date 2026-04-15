const pool = require('../../db');

class PointsService {
  async getPointsByUser(userId) {
    const query = `
      SELECT p.*, t.name as type_name, t.icon_url as type_icon,
        COALESCE(
          (SELECT json_agg(image_url) FROM object_images WHERE point_id = p.id), 
          '[]'::json
        ) as images
      FROM object_points p
      JOIN types t ON p.type_id = t.id
      WHERE p.created_by = $1
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  async getAllPoints() {
  const query = `
    SELECT p.*, t.name as type_name, t.icon_url as type_icon,
      COALESCE(
        (SELECT json_agg(image_url) FROM object_images WHERE point_id = p.id), 
        '[]'::json
      ) as images
    FROM object_points p
    JOIN types t ON p.type_id = t.id
    ORDER BY p.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

  async addPoint({ name, description, address, latitude, longitude, type_id, created_by, tags, phone, status, image_urls }) {
  const client = await pool.connect(); // Gunakan client untuk transaksi
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
        await client.query(imageQuery, [pointId, image_urls[i], i === 0]); // is_primary true for the first image
      }
    }

    await client.query('COMMIT');
    
    return { 
      id: pointId, 
      name, 
      description, 
      address, 
      latitude, 
      longitude, 
      type_id, 
      phone, 
      status, 
      images: image_urls || []
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

  async updatePoint(id, { name, description, address, latitude, longitude, type_id, tags, phone, status, image_urls }) {
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

    await client.query('COMMIT');
    return pointResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

  async deletePoint(id) {
    const query = 'DELETE FROM object_points WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = new PointsService();