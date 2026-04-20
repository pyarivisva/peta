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
    pgm.createTable('clusters', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true, unique: true },
        description: { type: 'text' }
    });

    pgm.addColumn('types', {
        cluster_id: {
            type: 'integer',
            references: '"clusters"',
            onDelete: 'SET NULL' // Jika rumpun dihapus, tipe tidak ikut terhapus tapi jadi NULL
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumn('types', 'cluster_id');
    pgm.dropTable('clusters');
};
