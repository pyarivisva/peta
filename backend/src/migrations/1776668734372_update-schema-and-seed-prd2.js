/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm 
 * @param run
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {

    // Update Schema cluster_foods
    pgm.addColumns('cluster_foods', {
        price_min: { type: 'numeric' },
        price_max: { type: 'numeric' },
        menu_image_url: { type: 'varchar(255)' },
        open_time: { type: 'time' },
        close_time: { type: 'time' }
    });

    // Update Schema cluster_natures
    pgm.renameColumn('cluster_natures', 'entry_fee', 'entry_fee_min');
    pgm.addColumns('cluster_natures', {
        entry_fee_max: { type: 'numeric' }
    });

    // Buat Tabel Fasilitas Alam (Many-to-Many)
    pgm.createTable('facilities', {
        id: 'id',
        name: { type: 'varchar(100)', unique: true, notNull: true }
    });

    pgm.createTable('nature_facilities', {
        point_id: { type: 'integer', notNull: true, references: '"object_points"', onDelete: 'CASCADE' },
        facility_id: { type: 'integer', notNull: true, references: '"facilities"', onDelete: 'CASCADE' }
    }, {
        constraints: { primaryKey: ['point_id', 'facility_id'] }
    });

    // Buat Tabel Tipe Healthcare (Many-to-Many)
    pgm.createTable('healthcare_types', {
        id: 'id',
        name: { type: 'varchar(100)', unique: true, notNull: true }
    });

    pgm.createTable('healthcare_facilities_link', {
        point_id: { type: 'integer', notNull: true, references: '"object_points"', onDelete: 'CASCADE' },
        healthcare_type_id: { type: 'integer', notNull: true, references: '"healthcare_types"', onDelete: 'CASCADE' }
    }, {
        constraints: { primaryKey: ['point_id', 'healthcare_type_id'] }
    });

    // Menggunakan SQL raw di dalam migrasi untuk operasi data masal yang kompleks
    
    pgm.sql(`
        -- Update Nama Rumpun (Clusters)
        UPDATE clusters SET name = 'Restoran' WHERE name IN ('Food & Beverage', 'F&B');
        UPDATE clusters SET name = 'Alam' WHERE name IN ('Nature & Outdoor', 'Wisata Alam & Rekreasi');

        -- Seed Master Checklist Fasilitas Alam
        INSERT INTO facilities (name) VALUES 
        ('Parkir'), ('Toilet'), ('Musholla'), ('Gazebo'), ('Warung Makan'), ('Area Camping'), ('WIFI')
        ON CONFLICT (name) DO NOTHING;

        -- Seed Master Checklist Healthcare
        INSERT INTO healthcare_types (name) VALUES 
        ('Rumah Sakit (RS)'), ('Puskesmas'), ('Klinik'), ('Apotek'), ('Laboratorium')
        ON CONFLICT (name) DO NOTHING;

        -- Update Nama Kategori/Type Lama agar Konsisten
        UPDATE types SET name = 'Restoran' WHERE name = 'Cafe';
        UPDATE types SET name = 'Rumah Sakit Umum' WHERE name = 'Rumah Sakit';
        UPDATE types SET name = 'Universitas' WHERE name = 'Kampus';

        -- Seeding Master Data Types Baru
        -- Catatan: Menggunakan ON CONFLICT DO NOTHING karena tabel types punya UNIQUE(name)
        
        -- Cluster 1: Restoran
        INSERT INTO types (name, icon_url, description, cluster_id) VALUES 
        ('Cafe', 'https://cdn-icons-png.flaticon.com/512/2734/2734023.png', 'Tempat kopi dan santai', 1),
        ('Warung Makan', 'https://cdn-icons-png.flaticon.com/512/2082/2082045.png', 'Tempat makan tradisional', 1),
        ('Kedai Kopi', 'https://cdn-icons-png.flaticon.com/512/3223/3223058.png', 'Spesialis kopi', 1),
        ('Food Court', 'https://cdn-icons-png.flaticon.com/512/2082/2082051.png', 'Area pujasera', 1)
        ON CONFLICT (name) DO NOTHING;

        -- Cluster 2: Alam
        INSERT INTO types (name, icon_url, description, cluster_id) VALUES 
        ('Air Terjun', 'https://cdn-icons-png.flaticon.com/512/2361/2361362.png', 'Wisata air terjun', 2),
        ('Gunung', 'https://cdn-icons-png.flaticon.com/512/2928/2928811.png', 'Wisata pendakian gunung', 2),
        ('Danau', 'https://cdn-icons-png.flaticon.com/512/2913/2913504.png', 'Wisata danau', 2),
        ('Hutan Pinus', 'https://cdn-icons-png.flaticon.com/512/1000/1000969.png', 'Wisata hutan pinus', 2)
        ON CONFLICT (name) DO NOTHING;

        -- Cluster 3: Accommodation
        INSERT INTO types (name, icon_url, description, cluster_id) VALUES 
        ('Hotel', 'https://cdn-icons-png.flaticon.com/512/3009/3009489.png', 'Akomodasi hotel modern', 3),
        ('Villa', 'https://cdn-icons-png.flaticon.com/512/2836/2836691.png', 'Akomodasi villa eksklusif', 3),
        ('Guest House', 'https://cdn-icons-png.flaticon.com/512/2558/2558071.png', 'Penginapan tamu', 3),
        ('Homestay', 'https://cdn-icons-png.flaticon.com/512/619/619153.png', 'Rumah tinggal lokal', 3),
        ('Resort', 'https://cdn-icons-png.flaticon.com/512/2983/2983973.png', 'Resort mewah', 3)
        ON CONFLICT (name) DO NOTHING;

        -- Cluster 4: Healthcare
        INSERT INTO types (name, icon_url, description, cluster_id) VALUES 
        ('Puskesmas', 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png', 'Pusat kesehatan masyarakat', 4),
        ('Klinik Pratama', 'https://cdn-icons-png.flaticon.com/512/1043/1043224.png', 'Klinik kesehatan swasta', 4),
        ('Apotek', 'https://cdn-icons-png.flaticon.com/512/822/822143.png', 'Toko obat', 4)
        ON CONFLICT (name) DO NOTHING;

        -- Cluster 5: Education
        INSERT INTO types (name, icon_url, description, cluster_id) VALUES 
        ('Sekolah', 'https://cdn-icons-png.flaticon.com/512/3050/3050017.png', 'Pendidikan dasar dan menengah', 5),
        ('SMA/SMK', 'https://cdn-icons-png.flaticon.com/512/2941/2941658.png', 'Pendidikan tingkat menengah atas', 5),
        ('SMP', 'https://cdn-icons-png.flaticon.com/512/5354/5354397.png', 'Pendidikan tingkat menengah pertama', 5),
        ('SD', 'https://cdn-icons-png.flaticon.com/512/2231/2231461.png', 'Pendidikan tingkat dasar', 5),
        ('TK', 'https://cdn-icons-png.flaticon.com/512/3663/3663806.png', 'Pendidikan anak usia dini', 5)
        ON CONFLICT (name) DO NOTHING;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Drop Checklists Tables (Akan ikut menghapus relasinya karena CASCADE)
    pgm.dropTable('healthcare_facilities_link');
    pgm.dropTable('healthcare_types');
    pgm.dropTable('nature_facilities');
    pgm.dropTable('facilities');

    // Rollback column cluster_natures
    pgm.dropColumns('cluster_natures', ['entry_fee_max']);
    pgm.renameColumn('cluster_natures', 'entry_fee_min', 'entry_fee');

    // Rollback column cluster_foods
    pgm.dropColumns('cluster_foods', ['price_min', 'price_max', 'menu_image_url', 'open_time', 'close_time']);

};