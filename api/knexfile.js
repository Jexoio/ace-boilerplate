/* eslint-disable */
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

module.exports = {
    development: {
        client: process.env.DB_DIALECT,
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations/',
            stub: './db/migrations.stub',
        },
        seeds: {
            directory: './db/seeds',
        },
    },
    production: {
        client: process.env.DB_DIALECT,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations/',
        },
    },
};
