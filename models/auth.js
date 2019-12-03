/**
 * Express router providing user authentication routes
 * @module model/auth
 * @requires bcrypt
 */

/**
 * BCrypt module
 * @const
 */
const bcrypt = require('bcryptjs')

/**
 * Auth module
 *  @namespace authModel
 */
const auth = {

  /**
   * Synchronise user entered password with the encrypted password stored
   * @param  {string} password - User password requested
   * @param  {string} dbHash - Database hash for password in storage
   * @return {boolean} - Passwords match
   * @memberof module:model/auth~authModel
   */
  syncPassword: function(password, dbHash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, dbHash, function(err, valid) {
          if(valid) {
            resolve(true)
          }
          else{
            resolve(false)
          }
      });
    })
  },
  /**
   * Synchronise user entered password with the encrypted password stored
   * @param  {integer} rounds - Amount of rounds to hash
   * @param  {string} password - Database password to generate. If left null default value will trigger for a random string
   * @return {boolean} - Password string, password hash
   * @memberof module:model/auth~authModel
   */
  generateHash: (rounds, password = 'random') => {
    let newPassword = password === 'random' ? auth.generatePassword() : password
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, rounds, (err, hash) => {
        if(err) {
          console.log(err)
          resolve(null)
        }else{
          resolve({ newPassword, hash })
        }
      })
    })
  },
  /**
   * Generate password string
   * @return {string} Generated password
   * @memberof module:model/auth~authModel
   */
  generatePassword: () => {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

}

/**
 * AUTH exports
 * @return {object}
 */
module.exports = auth
