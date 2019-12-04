/**
 * Express router providing user authentication routes
 * @module api
 * @requires userApi
 * {@link module:api/user}
 */
/**
 * User API router module
 * @const
 */
const userApi = require(`${appRoot}/api/user`)
// const anotherApi = require(`${appRoute}/api/another-api`)

/**
 * Entry point to consume API routes
 * @param  {object} app - Express instance
 */
function start(app) {
  app.use('/api/user', userApi)
  // app.use('/another-api', anotherApi)
}

/**
 * API exports
 * @type {object}
 * @return {function}
 */
module.exports = {
  start
}
