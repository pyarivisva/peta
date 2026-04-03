const pool = require('../../db');
const bcrypt = require('bcryptjs');

class AuthService {
  async getUserByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  async createUser(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email';
    const { rows } = await pool.query(query, [username, hashedPassword, email || null]);
    return rows[0];
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new AuthService();