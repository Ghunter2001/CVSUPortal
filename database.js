const { createPool } = require('mysql');


const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT
});

// const pool = createPool({
//     host: process.env.MYSQL_ADDON_HOST,
//     user: process.env.MYSQL_ADDON_USER,
//     password: process.env.MYSQL_ADDON_PASSWORD,
//     database: process.env.MYSQL_ADDON_DB
// });

module.exports = pool;