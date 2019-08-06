import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('name').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('users');
}
