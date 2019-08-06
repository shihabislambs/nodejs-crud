import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table('todos', function(table) {
    table.integer('user').unsigned().notNullable();
    table.foreign('user').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table('todos', function(table) {
    table.dropColumn('user');
  });
}
