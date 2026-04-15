const pool = require('./db');

async function runMigration() {
  try {
    console.log('Migrating Database...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_saved_points (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        point_id INTEGER REFERENCES object_points(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, point_id)
      );

      CREATE TABLE IF NOT EXISTS user_history (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        point_id INTEGER REFERENCES object_points(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, point_id)
      );
    `);
    console.log('Migration Complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

runMigration();
