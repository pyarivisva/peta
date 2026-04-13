const pool = require('../../db');

class PointsService {
  async getPointsByUser(userId) {
    const query = `
      SELECT p.*, t.name as type_name, t.icon_url as type_icon
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
    SELECT p.*, t.name as type_name, img.image_url
    FROM object_points p
    JOIN types t ON p.type_id = t.id
    LEFT JOIN (
        SELECT point_id, image_url 
        FROM object_images 
        WHERE is_primary = true 
        LIMIT 1
    ) img ON p.id = img.point_id
    ORDER BY p.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

  async addPoint({ name, description, address, latitude, longitude, type_id, created_by, tags, phone, status, image_url }) {
  const client = await pool.connect(); // Gunakan client untuk transaksi
  try {
    await client.query('BEGIN');

    // 1. Simpan data utama ke object_points (TANPA image_url)
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

    // 2. Simpan path gambar ke tabel object_images
    if (image_url) {
      const imageQuery = `
        INSERT INTO object_images (point_id, image_url, is_primary)
        VALUES ($1, $2, $3)
      `;
      await client.query(imageQuery, [pointId, image_url, true]); // is_primary set true
    }

    await client.query('COMMIT');
    
    // Kembalikan data lengkap (bisa di-join jika perlu)
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
      image_url 
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

  async updatePoint(id, { name, description, address, latitude, longitude, type_id, tags, phone, status, image_url }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update tabel object_points (Hapus image_url dari query ini)
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

    // 2. Jika ada image_url baru, update tabel object_images
    if (image_url) {
      // Kita asumsikan update is_primary image untuk point ini
      const imageQuery = `
        INSERT INTO object_images (point_id, image_url, is_primary)
        VALUES ($1, $2, true)
        ON CONFLICT (point_id) DO UPDATE SET image_url = $2
      `;
      // Note: ON CONFLICT butuh UNIQUE constraint pada point_id jika One-to-One
      // Jika One-to-Many, kamu bisa hapus yang lama lalu insert baru:
      await client.query('DELETE FROM object_images WHERE point_id = $1 AND is_primary = true', [id]);
      await client.query('INSERT INTO object_images (point_id, image_url, is_primary) VALUES ($1, $2, true)', [id, image_url]);
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