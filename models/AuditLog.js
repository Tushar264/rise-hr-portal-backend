const mongoose = require('mongoose')

const auditSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  actionType: String,
  target: String,
  reason: String,

}, {
  timestamps: true,
})

module.exports = mongoose.model('AuditLog', auditSchema)