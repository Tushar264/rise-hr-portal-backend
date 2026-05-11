const jwt = require('jsonwebtoken')

const User = require('../models/User')

const protect = async (
  req,
  res,
  next
) => {

  try {

    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      token =
        req.headers.authorization.split(' ')[1]

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        )

      const user =
        await User.findById(decoded.id)

      if (!user) {

        return res.status(404).json({
          message: 'User not found',
        })
      }

      req.user = user

      next()

    } else {

      return res.status(401).json({
        message: 'No token found',
      })
    }

  } catch (error) {

    return res.status(401).json({
      message: 'Unauthorized',
    })
  }
}

module.exports = protect