const mongoose = require('mongoose')

const replySchema =
  new mongoose.Schema({

    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announcement',
    },

    parentReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
      default: null,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    body: {
      type: String,
      required: true,
    },

  }, {
    timestamps: true,
  })

module.exports = mongoose.model(
  'Reply',
  replySchema
)