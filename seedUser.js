const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config()

const User = require('./models/User')


async function connectDB() {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    )

    console.log('MongoDB Connected')

  } catch (error) {

    console.log(error)

    process.exit(1)
  }
}


async function seedUsers() {

  try {

    await connectDB()

    await User.deleteMany()

    await User.create({

      name: 'Admin User',

      email: 'admin@gmail.com',

      role: 'ADMIN',
    })

    await User.create({

      name: 'Employee User',

      email: 'employee@gmail.com',

      role: 'MEMBER',
    })

    console.log('Users Created')

    process.exit()

  } catch (error) {

    console.log(error)

    process.exit(1)
  }
}

seedUsers()