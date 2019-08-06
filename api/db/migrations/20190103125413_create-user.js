/* eslint-disable import/no-commonjs */
exports.up = knex => knex.schema.createTable('users', (table) => {
  table.timestamp('created_at', { useTz: true });
  table.timestamp('updated_at', { useTz: true });
  table.timestamp('deleted_at', { useTz: true });
  table.uuid('id').primary();
  table.string('user_account_id');
  table.string('client_key');
  table.index('client_key');
  // table.foreign('user_id').references('Items.user_id_in_items');
});

exports.down = knex => knex.schema.dropTableIfExists('users');
