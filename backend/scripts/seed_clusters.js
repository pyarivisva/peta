const pool = require('../db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Seed Clusters
    const clusters = [
      'Food & Beverage',
      'Nature & Outdoor',
      'Accommodation',
      'Healthcare',
      'Education'
    ];

    console.log('Seeding clusters...');
    for (const clusterName of clusters) {
      await client.query(
        'INSERT INTO clusters (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [clusterName]
      );
    }

    // 2. Get Cluster IDs
    const { rows: clusterRows } = await client.query('SELECT id, name FROM clusters');
    const clusterMap = {};
    clusterRows.forEach(row => {
      clusterMap[row.name] = row.id;
    });

    // 3. Update Existing Types to link with Clusters
    console.log('Mapping types to clusters...');
    
    const typeMapping = {
      'Cafe': clusterMap['Food & Beverage'],
      'Restoran': clusterMap['Food & Beverage'],
      'Warung': clusterMap['Food & Beverage'],
      'Pantai': clusterMap['Nature & Outdoor'],
      'Gunung': clusterMap['Nature & Outdoor'],
      'Air Terjun': clusterMap['Nature & Outdoor'],
      'Danau': clusterMap['Nature & Outdoor'],
      'Hotel': clusterMap['Accommodation'],
      'Villa': clusterMap['Accommodation'],
      'Guest House': clusterMap['Accommodation'],
      'Rumah Sakit': clusterMap['Healthcare'],
      'Klinik': clusterMap['Healthcare'],
      'Puskesmas': clusterMap['Healthcare'],
      'Sekolah': clusterMap['Education'],
      'Universitas': clusterMap['Education'],
      'Perpustakaan': clusterMap['Education']
    };

    for (const [typeName, clusterId] of Object.entries(typeMapping)) {
      await client.query(
        'UPDATE types SET cluster_id = $1 WHERE name = $2',
        [clusterId, typeName]
      );
    }

    // Optional: Set default cluster for any types not in mapping
    // Here we just map known ones.

    await client.query('COMMIT');
    console.log('Seeding and mapping completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
