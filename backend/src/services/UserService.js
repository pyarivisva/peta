const pool = require('../../db');

class UserService {
  async getSavedLocations(userId) {
    const query = `
      SELECT point_id FROM user_saved_points WHERE user_id = $1 ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map(r => r.point_id);
  }

  async toggleSavedLocation(userId, pointId) {
    const checkQuery = `SELECT * FROM user_saved_points WHERE user_id = $1 AND point_id = $2`;
    const { rowCount } = await pool.query(checkQuery, [userId, pointId]);

    if (rowCount > 0) {
      await pool.query(`DELETE FROM user_saved_points WHERE user_id = $1 AND point_id = $2`, [userId, pointId]);
      return { status: 'removed', pointId };
    } else {
      await pool.query(`INSERT INTO user_saved_points (user_id, point_id) VALUES ($1, $2)`, [userId, pointId]);
      return { status: 'saved', pointId };
    }
  }

  async getHistoryLocations(userId) {
    const query = `
      SELECT point_id FROM user_history WHERE user_id = $1 ORDER BY viewed_at DESC LIMIT 10
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map(r => r.point_id);
  }

  async addToHistory(userId, pointId) {
    const query = `
      INSERT INTO user_history (user_id, point_id, viewed_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, point_id) 
      DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [userId, pointId]);
    
    const cleanupQuery = `
      DELETE FROM user_history
      WHERE ctid NOT IN (
        SELECT ctid FROM user_history WHERE user_id = $1 ORDER BY viewed_at DESC LIMIT 10
      ) AND user_id = $1
    `;
    await pool.query(cleanupQuery, [userId]);

    return { status: 'added', pointId };
  }
}

module.exports = new UserService();
