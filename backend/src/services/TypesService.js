const pool = require('../../db');

class TypesService {
  async getAllTypes() {
    const { rows } = await pool.query('SELECT * FROM types ORDER BY name ASC');
    return rows;
  }
}

module.exports = new TypesService();