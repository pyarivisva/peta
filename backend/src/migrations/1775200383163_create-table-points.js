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
    pgm.createTable('object_points', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        description: { type: 'text' },
        address: { type: 'text' },
        latitude: { type: 'double precision', notNull: true },
        longitude: { type: 'double precision', notNull: true },
        type_id: {
        type: 'integer',
        notNull: true,
        references: '"types"',
        onDelete: 'RESTRICT', 
        },
        phone: { type: 'varchar(20)' },
        status: { type: 'varchar(50)', default: 'Open' },
        tags: { type: 'jsonb' },
        created_by: { type: 'integer', references: '"users"', onDelete: 'SET NULL' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('object_points');
};
