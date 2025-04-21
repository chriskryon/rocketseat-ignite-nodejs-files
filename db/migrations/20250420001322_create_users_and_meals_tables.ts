import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.timestamp('datetime').notNullable(); // Coluna datetime corretamente configurada
    table.boolean('is_diet').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
  await knex.schema.dropTable('users');
}
