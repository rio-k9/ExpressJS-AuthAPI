/**
 * Express router providing user authentication routes
 * @module api/user
 * @requires express
 * @requires jwt
 * @requires database
 * @requires model/user
 * {@link module:model/user}
 * @requires model/auth
 * {@link module:model/auth}
 */

 /**
  * Express module
  * @const
  */
 const express    = require('express');

/**
 * Database module
 * @const
 */
const db = require(`${appRoot}/db`)

/**
 * Json Web Token (JWT) module
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * User model (JWT) module
 * @const
 */
const _USER = require(`${appRoot}/models/user.js`)

/**
 * Authentication model
 * @const
 */
const _AUTH = require(`${appRoot}/models/auth.js`)


/**
 * Express router to mount user authentication functions.
 * @type {object}
 * @const
 * @namespace userApi
 */
const api = express.Router();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

/**
  * Route serving login form.
  * @name post/login
  * @function
  * @memberof module:apis~usersApi
  * @inner
  * @param {object} connection - MySQL connection
  * @param {string} middleware - Requested username
  * @inner
  * @param {string} password - User password requested
  * @param {string} password - Hash encrypted password stored
  * @memberof module:api/user~userApi
  */
api.post('/login', (req, res) => {
  _USER.loginUser(db.connection, req.body.username).then((user) => {
    if (!user.error) {
      _AUTH.syncPassword(req.body.password, user.password).then((valid) => {
        if (valid) {
          jwt.sign({
            user
          }, db.secretToken, (err, token) => {
            res.json({
              token
            })
          })
        } else {
          res.sendStatus(401)
        }
      })
    } else {
      res.sendStatus(401)
    }
  })
})

/**
 * Route serving login form.
 * @name get/me
 * @function
 * @memberof module:apis~usersApi
 * @inner
 * @param {module} connection - MySQL connection
 * @param {string} middleware - Secret hash token, loaded from config
 * @memberof module:api/user~userApi
 */
api.get('/me', verifyToken, (req, res) => {
  jwt.verify(req.token, db.secretToken, (err, authData) => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        user: authData.user
      })
    }
  })
})

/**
 * Route serving login form.
 * @name post/create
 * @function
 * @memberof module:apis~usersApi
 * @inner
 * @param {module} connection - MySQL connection
 * @param {string} middleware - Requested username
 * @memberof module:api/user~userApi
 */
api.post('/create', verifyToken, (req, res) => {
  jwt.verify(req.token, db.secretToken, (err, authData) => {
    if (err) {
      res.sendStatus(401)
    } else {
      let authPromise = _AUTH.generateHash(12)
      authPromise.then((passwords) => {
        let userData = Object.assign({}, {
          password: passwords.hash,
        }, req.body.data)
        let userPromise = _USER.createUser(db.connection, userData)

        userPromise.then((resolved) => {
          if (!resolved.error) {
            res.json({
              http: 200,
              status: 'success',
              password: passwords.newPassword
            })
          } else {
            res.json({
              http: 503,
              status: resolved.error
            })
          }
        })
      })
    }
  })
})

/**
 * Route serving login form.
 * @name post/update
 * @function
 * @memberof module:routerss~usersRouter
 * @inner
 * @param {module} connection - MySQL connection
 * @param {string} middleware - Requested username
 * @memberof module:api/user~userApi
 */
api.post('/update', verifyToken, (req, res) => {
  jwt.verify(req.token, db.secretToken, (err, authData) => {
    if (err) {
      res.sendStatus(401)
    } else {
      let userPromise = _USER.updateUser(db.connection, req.body.data)

      userPromise.then((resolved) => {
        if (!resolved.error) {
          res.json({
            http: 200,
            status: 'success'
          })
        } else {
          res.json({
            http: 503,
            status: resolved.error
          })
        }
      })
    }
  })
})

/**
 * Route serving login form.
 * @name post/password/change
 * @function
 * @memberof module:routerss~usersRouter
 * @inner
 * @param {module} connection - MySQL connection
 * @param {string} middleware - Requested username
 * @memberof module:api/user~userApi
 */
api.post('/password/change', verifyToken, (req, res) => {
  jwt.verify(req.token, db.secretToken, (err, authData) => {
    if (err) {
      res.sendStatus(401)
    } else {
      let authPromise = _AUTH.generateHash(12, req.body.password)
      authPromise.then((passwords) => {
        let passwordPromise = _USER.changePassword(db.connection, {
          password: passwords.hash,
          username: req.body.data.username
        })
        passwordPromise.then((resolved) => {
          if (!resolved.error) {
            res.json({
              http: 200,
              status: 'success'
            })
          } else {
            res.json({
              http: 503,
              status: resolved.error
            })
          }
        })
      })
    }
  })
})

/**
 * Route serving login form.
 * @name post/password/reset
 * @function
 * @memberof module:routerss~usersRouter
 * @inner
 * @param {module} connection - MySQL connection
 * @param {string} middleware - Requested username
 * @return {object} - Authorisation data
 * @memberof module:api/user~userApi
 */
api.post('/password/reset', verifyToken, (req, res) => {
  jwt.verify(req.token, db.secretToken, (err, authData) => {
    if (err) {
      res.sendStatus(401)
    } else {
      let authPromise = _AUTH.generateHash(12)
      authPromise.then((passwords) => {
        let passwordPromise = _USER.changePassword(db.connection, {
          password: passwords.hash,
          username: req.body.data.username
        })
        passwordPromise.then((resolved) => {
          if (!resolved.error) {
            res.json({
              http: 200,
              status: 'success',
              password: passwords.newPassword
            })
          } else {
            res.json({
              http: 503,
              status: resolved.error
            })
          }
        })
      })
    }
  })
})

/**
 * AUTH exports
 * @return {object}
 */
module.exports = api
