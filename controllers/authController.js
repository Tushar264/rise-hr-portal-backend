const User = require('../models/User')

const generateToken = require(
  '../utils/generateToken'
)

const login = async (req, res) => {

  try {

    console.log(req.body)

    const { email } = req.body

    console.log('Searching for:', email)

    const user = await User.findOne({
      email,
    })

    console.log('Found user:', user)

    if (!user) {

      return res.status(404).json({
        message: 'User not found',
      })
    }

    const token =
      generateToken(user._id)

    res.json({
      token,
      user,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  login,
}