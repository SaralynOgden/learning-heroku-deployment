'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('buses', (table) => {
    table.increments();
    table.string('bus_number').notNullable().defaultTo('');
    table.string('stop_number').notNullable().defaultTo('');
    table.timestamp('scheduled_time').notNullable();
    table.timestamp('actual_time').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('buses');
};
