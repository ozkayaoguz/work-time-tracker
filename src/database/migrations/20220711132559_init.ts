import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('user', (table) => {
    setIdField(knex, table);
    table.string('name', 64);
    table.string('email', 64).notNullable().unique();
    table.string('password', 64).notNullable();
    setRecordTimeFields(table);
  });

  await knex.schema.createTable('work_log', (table) => {
    setIdField(knex, table);
    table.string('description', 64).notNullable();
    table.datetime('started_at').defaultTo(knex.fn.now());
    table.datetime('ended_at');
    table.uuid('user_id').references('id').inTable('user').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('work_log');
  await knex.schema.dropTable('user');
}

function setIdField(knex: Knex, table: Knex.CreateTableBuilder) {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
}

function setRecordTimeFields(table: Knex.CreateTableBuilder) {
  table.timestamps(true, true);
}
