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
    // Mengambil titik beserta nama kategorinya
    const query = `
      SELECT p.*, t.name as type_name, t.icon_url as type_icon
      FROM object_points p
      JOIN types t ON p.type_id = t.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async addPoint({ name, description, address, latitude, longitude, type_id, created_by, tags }) {
    const query = `
      INSERT INTO object_points 
      (name, description, address, latitude, longitude, type_id, created_by, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const safeTags = JSON.stringify(tags || []);

    const values = [name, description, address, latitude, longitude, type_id, created_by, safeTags];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async updatePoint(id, { name, description, address, latitude, longitude, type_id, tags }) {
  const query = `
    UPDATE object_points 
    SET name = $1, description = $2, address = $3, latitude = $4, longitude = $5, type_id = $6, tags = $7
    WHERE id = $8
    RETURNING *
  `;
  const safeTags = JSON.stringify(tags || []);
  const values = [name, description, address, latitude, longitude, type_id, safeTags, id];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
  }

  async deletePoint(id) {
    const query = 'DELETE FROM object_points WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = new PointsService();