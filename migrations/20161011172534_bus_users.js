'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('bus_users', (table) => {
    table.increments();
    table.integer('user_id').references('id')
        .inTable('users').onDelete('CASCADE').index();
    table.integer('bus_id').references('id')
         .inTable('buses').onDelete('CASCADE').index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bus_users');
};
