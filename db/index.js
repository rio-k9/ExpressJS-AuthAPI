/**
 * Express router providing user authentication routes
 * @module database
 * @requires config
 * @requires MySQL
 * @requires consola
 */
/**
 * Server configuration
 * @const
 */
const config = require(`${appRoot}/config`)

/**
 * MySQL module
 * @const
 */
const mysql = require('mysql');

/**
 * MySQL connection pool
 * @const
 */
const pool = mysql.createPool(config.DB);

/**
 * JWT secret token
 * @const
 */
const secretToken = config.SECRET_TOKEN

/**
 * Consola module
 * @const
 */
const consola = require('consola')

/**
 * MySQL - Test a connection to pool
 */
pool.getConnection(function (err, connection) {
    if (err) {
        consola.error({
          message: 'MySQL errored: ' + err,
          badge: true
        })
        return;
    }
    consola.ready({
      message: 'MySQL connected',
      badge: true
    })
});

module.exports = {
    connection: pool,
    secretToken
}
