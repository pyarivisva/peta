require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Memulai Seeding...');

    const hashedPw = await bcrypt.hash('admin123', 10);
    const userRes = await client.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      ['admin', hashedPw, 'admin@geomap.com']
    );
    const adminId = userRes.rows[0].id;

    const typeRes = await client.query(`
      INSERT INTO types (name, icon_url, description) VALUES 
      ('Pantai', 'https://cdn-icons-png.flaticon.com/512/2664/2664589.png', 'Wisata pesisir pantai'),
      ('Cafe', 'https://cdn-icons-png.flaticon.com/512/2734/2734023.png', 'Tempat nongkrong dan kopi'),
      ('Rumah Sakit', 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', 'Fasilitas kesehatan')
      RETURNING id, name
    `);

    const categories = typeRes.rows;
    const pantaiId = categories.find(c => c.name === 'Pantai').id;
    const cafeId = categories.find(c => c.name === 'Cafe').id;

    await client.query(`
      INSERT INTO object_points (name, description, address, latitude, longitude, type_id, created_by, tags) VALUES 
      ('Pantai Sanur', 'Pantai dengan sunrise terbaik', 'Sanur, Denpasar Selatan', -8.6749, 115.2631, $1, $3, '["Sunrise", "Jogging Track", "Parkir"]'),
      ('Kopi Kultur', 'Cafe estetik di pusat kota', 'Jl. Tantular, Denpasar', -8.6698, 115.2345, $2, $3, '["WiFi", "Indoor", "Outdoor"]')
    `, [pantaiId, cafeId, adminId]);

    console.log('Seeding Berhasil! Data awal siap digunakan.');
  } catch (err) {
    console.error('Seeding Gagal:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();