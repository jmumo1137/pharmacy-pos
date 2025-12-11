exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('action').notNullable();
    table.string('module', 50);
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('activity_logs');
};
