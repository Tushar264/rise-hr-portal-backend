require('dotenv').config()
const generateToken = require('./utils/generateToken')

console.log(
  generateToken(
    '6a002f97a5ac78129238a458'
  )
)