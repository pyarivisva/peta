/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('cluster_foods', {
        point_id: {
            type: 'integer',
            primaryKey: true,
            references: '"object_points"',
            onDelete: 'CASCADE'
        },
        signature_menu: { type: 'varchar(255)' },
        price_range: { type: 'varchar(50)' }, 
        opening_hours: { type: 'varchar(100)' },
        is_halal: { type: 'boolean', default: false },
        has_wifi: { type: 'boolean', default: false }
    });

    pgm.createTable('cluster_natures', {
        point_id: {
            type: 'integer',
            primaryKey: true,
            references: '"object_points"',
            onDelete: 'CASCADE'
        },
        elevation: { type: 'integer' },
        difficulty_level: { type: 'varchar(50)' },
        entry_fee: { type: 'decimal(10, 2)' },
        public_facilities: { type: 'text' }
    });

    pgm.createTable('cluster_accommodations', {
        point_id: {
            type: 'integer',
            primaryKey: true,
            references: '"object_points"',
            onDelete: 'CASCADE'
        },
        star_rating: { type: 'integer' },
        check_in_time: { type: 'varchar(20)' },
        check_out_time: { type: 'varchar(20)' },
        has_pool: { type: 'boolean', default: false }
    });

    pgm.createTable('cluster_healthcares', {
        point_id: {
            type: 'integer',
            primaryKey: true,
            references: '"object_points"',
            onDelete: 'CASCADE'
        },
        facility_type: { type: 'varchar(100)' },
        has_igd: { type: 'boolean', default: false },  
        accepts_bpjs: { type: 'boolean', default: false },
        ambulance_available: { type: 'boolean', default: false }
    });

    pgm.createTable('cluster_educations', {
        point_id: {
            type: 'integer',
            primaryKey: true,
            references: '"object_points"',
            onDelete: 'CASCADE'
        },
        education_level: { type: 'varchar(50)' },
        accreditation: { type: 'varchar(10)' },
        school_status: { type: 'varchar(50)' },
        has_library: { type: 'boolean', default: false }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('cluster_educations');
    pgm.dropTable('cluster_healthcares');
    pgm.dropTable('cluster_accommodations');
    pgm.dropTable('cluster_natures');
    pgm.dropTable('cluster_foods');
};
