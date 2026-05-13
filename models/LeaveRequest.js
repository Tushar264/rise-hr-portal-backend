const mongoose = require('mongoose')

const leaveRequestSchema =
  new mongoose.Schema({

    userId: {
      type: String,
      required: true,
    },

    leaveType: {
      type: String,

      enum: [

        'PTO',

        'HALF_DAY',

        'SICK',

        'PLANNED',

        'WFH',
      ],

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

    reason: {
      type: String,
    },

    rejectionReason: {
      type: String,
      default: '',
    },

    status: {
      type: String,

      enum: [
        'PENDING',
        'APPROVED',
        'REJECTED',
      ],

      default: 'PENDING',
    },

  }, {
    timestamps: true,
  })

module.exports = mongoose.model(
  'LeaveRequest',
  leaveRequestSchema
)