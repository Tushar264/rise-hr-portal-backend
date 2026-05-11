const mongoose = require('mongoose')
const dotenv = require('dotenv')

const calculateLeaveDays = require('./utils/calculateLeaveDays')

dotenv.config()

async function test() {

  try {

    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB Connected')

    const days = await calculateLeaveDays(
      '2026-05-11',
      '2026-05-16',
      false
    )

    console.log('Deducted Days:', days)

    process.exit()

  } catch (err) {

    console.log(err)

    process.exit(1)
  }
}

test()