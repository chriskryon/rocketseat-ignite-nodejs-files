import type { Knex } from 'knex'

// Não se edita uma migration que já foi enviada para o repositório
// Para alterar uma migration, é necessário criar uma nova migration
// Por que? Porque a migration é um histórico de alterações no banco de dados
// Se você altera uma migration, você altera o histórico
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
