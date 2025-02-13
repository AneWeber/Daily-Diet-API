import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table)=> {
    table.uuid('meal_id').primary()
    table.text('meal_title').notNullable()
    table.text('meal_description').notNullable()
    table.datetime('meal_time').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('modified_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

