import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('todos', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.boolean('is_done').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('todos');
}
