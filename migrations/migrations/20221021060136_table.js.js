/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('blogUser',(table)=>{
        table.increments('id').primary()
        table.string('Name').notNullable()
        table.string('Email').unique().notNullable()
        table.string('Password')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('blogUser')
};
