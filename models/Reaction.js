const mongoose = require('mongoose')

const reactionSchema =
  new mongoose.Schema({

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetType: {
      type: String,
      enum: ['POST', 'REPLY'],
    },

    reaction: {
      type: String,
      enum: ['LOVE', 'KNOWLEDGE'],
    },

  }, {
    timestamps: true,
  })

module.exports = mongoose.model(
  'Reaction',
  reactionSchema
)