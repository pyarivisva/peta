const pool = require('../../db');

class TypesService {
  async getAllTypes() {
    const query = `
      SELECT t.*, c.name as cluster_name 
      FROM types t 
      LEFT JOIN clusters c ON t.cluster_id = c.id 
      ORDER BY t.name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async getAllFacilities() {
    const { rows } = await pool.query('SELECT * FROM facilities ORDER BY name ASC');
    return rows;
  }

  async getAllHealthcareTypes() {
    const { rows } = await pool.query('SELECT * FROM healthcare_types ORDER BY name ASC');
    return rows;
  }

  async getAllClusters() {
    const { rows } = await pool.query('SELECT * FROM clusters ORDER BY id ASC');
    return rows;
  }
}

module.exports = new TypesService();