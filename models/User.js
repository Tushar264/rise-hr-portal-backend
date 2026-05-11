const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER'],
      default: 'MEMBER',
    },

    team: String,

    dob: Date,

    joinDate: Date,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)