/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // 1. Migrate Data (Optional logic if needed, but here we assume new structured fields are primary)
  // For safety, we could try to parse '9:00 - 18:00' into open_time and close_time
  // but since this is a cleanup of a development database, we'll focus on the schema cleanup.

  // 2. Drop redundant columns from cluster_foods
  pgm.dropColumns('cluster_foods', ['opening_hours', 'price_range']);

  // 3. Drop redundant columns from cluster_natures (if any)
  // According to check_columns, entry_fee is already replaced or wasn't there.
  // We'll double check if 'entry_fee' exists first or just drop if it does.
  // pgm.sql('ALTER TABLE cluster_natures DROP COLUMN IF EXISTS entry_fee');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Rollback logic: Add columns back if needed
  pgm.addColumns('cluster_foods', {
    opening_hours: { type: 'varchar(100)' },
    price_range: { type: 'varchar(50)' }
  });
};
