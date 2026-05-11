const mongoose = require('mongoose')

const holidaySchema = new mongoose.Schema({
  title: String,

  date: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model(
  'Holiday',
  holidaySchema
)