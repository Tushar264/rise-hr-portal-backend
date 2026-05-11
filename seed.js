const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI)

async function seed() {

  await User.deleteMany()

  const user = await User.create({
    name: 'Tushar',
    email: 'tushar@gmail.com',
    role: 'ADMIN',
  })

  console.log(user)

  process.exit()
}

seed()