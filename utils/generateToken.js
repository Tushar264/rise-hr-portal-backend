const jwt = require('jsonwebtoken')

const generateToken =
  (email) => {

    return jwt.sign(

      { email },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    )
}

module.exports =
  generateToken