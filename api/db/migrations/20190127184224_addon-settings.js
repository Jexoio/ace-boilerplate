exports.up = knex => knex.schema.createTable('AddonSettings', (table) => {
  table.timestamp('createdAt', { useTz: true });
  table.timestamp('updatedAt', { useTz: true });
  table.increments('id').primary();
  table.string('clientKey', 255);
  table.string('key', 255);
  table.json('val');
  table.index(['clientKey', 'key'], 'addon_settings_client_key_key');
});

exports.down = knex => knex.schema.dropTableIfExists('AddonSettings');
