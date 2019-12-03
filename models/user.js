/**
 * Express router providing user authentication routes
 * @module model/user
 * @requires mysql
 */


/**
 * MySQL module
 * @const
 */
const mysql = require('mysql');

/**
 *  User exports
 *  @namespace userModel
 */
module.exports = {

  /**
   * Login user method
   * @param  {object} db - Database connection
   * @param  {string} username - Username
   * @return {promise} - Passwords match
   * @memberof module:model/user~userModel
   */
  loginUser: (db, username) => {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery, ["users", "email", username]);
    return new Promise((resolve, reject) => {
      db.query(query, (err, row) => {
        if (err) {
          resolve({ error: err })
          return;
        }
        resolve(row[0])
      });
    })
  },
  /**
   * Delete user method
   * @param  {object} db - Database connection
   * @param  {string} username - Username
   * @return {promise} - MySQL message
   * @memberof module:model/user~userModel
   */
  deleteUser: (db, username) => {
    let deleteQuery = "DELETE from users where ?? = ?";
    let query = mysql.format(deleteQuery, ["email", username]);
    return new Promise((resolve, reject) => {
      db.query(query, (err, row) => {
        if (err) {
          resolve({ error: err })
        }
        resolve(row[0])
      });
    })
  },
  /**
   * Change Password user method
   * @param  {object} db - Database connection
   * @param  {object} data - User data
   * @return {promise} - MySQL message
   * @memberof module:model/user~userModel
   */
  changePassword: (db, data) => {
    let resetQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let query = mysql.format(resetQuery, ["users", "password", data.password, "email", data.username]);
    return new Promise((resolve, reject) => {
      db.query(query, (err, row) => {
        if (err) {
          resolve({
            error: err.sqlMessage
          })
        }
        else{
          if(!row.affectedRows){
            resolve({error: 'No user with that email exists.'})
          }
          else{
            resolve(row.affectedRows)
          }
        }
      });
    })
  },
  /**
   * Create user method
   * @param  {object} db - Database connection
   * @param  {object} user - User data
   * @return {promise} - MySQL message
   * @memberof module:model/user~userModel
   */
  createUser: (db, user) => {
    let createQuery = "UPDATE users (firstName, lastName, scope, email, password) VALUES (?, ?, ?, ?, ?)";
    let query = mysql.format(createQuery, [user.firstName, user.lastName, user.jobRole, user.username, user.password]);
    return new Promise((resolve, reject) => {
      db.query(query, (err, row) => {
        if (err) {
          resolve({
            error: err.sqlMessage
          })
        }
        else{
          resolve(row.affectedRows)
        }
      });
    })
  },
  /**
   * Update user method
   * @param  {object} db - Database connection
   * @param  {object} user - User data
   * @return {promise} - MySQL message
   * @memberof module:model/user~userModel
   */
  updateUser: (db, data) => {
    let updateQuery = "UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?";
    let query = mysql.format(updateQuery, [data.firstName, data.lastName, data.username, data.id]);
    return new Promise((resolve, reject) => {
      db.query(query, (err, row) => {
        if (err) {
          resolve({error: err})
        }
        else{
          resolve(row.affectedRows)
        }
      });
    })
  }
}
