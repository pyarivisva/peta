const pool = require('../../db');

class PointsService {
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
    const values = [name, description, address, latitude, longitude, type_id, created_by, JSON.stringify(tags)];
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