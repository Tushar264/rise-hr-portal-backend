const mongoose = require('mongoose')

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    leaveType: {
      type: String,
      enum: ['PTO', 'HALF_DAY', 'SICK', 'PLANNED', 'WFH'],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    deductedDays: {
      type: Number,
      required: true,
    },

    reason: String,

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    rejectionReason: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'LeaveRequest',
  leaveRequestSchema
)