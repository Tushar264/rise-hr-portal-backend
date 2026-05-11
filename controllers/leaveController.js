const LeaveRequest = require('../models/LeaveRequest')

const calculateLeaveDays = require(
  '../utils/calculateLeaveDays'
)

const createAuditLog = require(
  '../utils/createAuditLog'
)



// APPLY LEAVE
const applyLeave = async (req, res) => {

  try {

    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body


    // CHECK OVERLAPPING LEAVES
    const overlappingLeave =
      await LeaveRequest.findOne({

        userId: req.user._id,

        status: {
          $in: ['PENDING', 'APPROVED']
        },

        startDate: {
          $lte: endDate
        },

        endDate: {
          $gte: startDate
        }
      })


    if (overlappingLeave) {

      return res.status(400).json({
        message: 'Overlapping leave exists',
      })
    }


    // CALCULATE LEAVE DAYS
    const deductedDays =
      await calculateLeaveDays(
        startDate,
        endDate,
        leaveType === 'HALF_DAY'
      )


    // CREATE LEAVE
    const leave = await LeaveRequest.create({

      userId: req.user._id,

      leaveType,

      startDate,

      endDate,

      reason,

      deductedDays,

      status:
        leaveType === 'SICK'
          ? 'APPROVED'
          : 'PENDING',
    })


    // AUDIT LOG
    await createAuditLog({

      actorId: req.user._id,

      actionType: 'LEAVE_APPLIED',

      target:
        `${leave.leaveType} leave`,

      reason:
        leave.reason || '',
    })


    res.status(201).json(leave)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}



// GET MY LEAVES
const getMyLeaves = async (req, res) => {

  try {

    const leaves =
      await LeaveRequest.find({

        userId: req.user._id

      }).sort({
        createdAt: -1
      })

    res.json(leaves)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}



// GET PENDING LEAVES (ADMIN)
const getPendingLeaves =
  async (req, res) => {

    try {

      const leaves =
        await LeaveRequest.find({

          status: 'PENDING',

        })

        .populate('userId')

        .sort({
          createdAt: -1
        })

      res.json(leaves)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// APPROVE LEAVE
const approveLeave =
  async (req, res) => {

    try {

      const leave =
        await LeaveRequest.findById(
          req.params.id
        )

      if (!leave) {

        return res.status(404).json({
          message: 'Leave not found',
        })
      }

      leave.status = 'APPROVED'

      leave.approvedBy =
        req.user._id

      await leave.save()


      // AUDIT LOG
      await createAuditLog({

        actorId: req.user._id,

        actionType: 'LEAVE_APPROVED',

        target:
          leave._id.toString(),
      })


      res.json(leave)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// REJECT LEAVE
const rejectLeave =
  async (req, res) => {

    try {

      const leave =
        await LeaveRequest.findById(
          req.params.id
        )

      if (!leave) {

        return res.status(404).json({
          message: 'Leave not found',
        })
      }

      leave.status = 'REJECTED'

      leave.rejectionReason =
        req.body.reason

      leave.approvedBy =
        req.user._id

      await leave.save()


      // AUDIT LOG
      await createAuditLog({

        actorId: req.user._id,

        actionType: 'LEAVE_REJECTED',

        target:
          leave._id.toString(),

        reason:
          leave.rejectionReason,
      })


      res.json(leave)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



module.exports = {

  applyLeave,

  getMyLeaves,

  getPendingLeaves,

  approveLeave,

  rejectLeave,
}