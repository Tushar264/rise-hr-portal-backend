const LeaveRequest = require(
  '../models/LeaveRequest'
)

const getLeaveBalance = require(
  '../utils/getLeaveBalance'
)

const createAuditLog = require(
  '../utils/createAuditLog'
)



// APPLY LEAVE
const applyLeave =
  async (req, res) => {

    try {
      console.log(req.user)
      
      const {
        leaveType,
        startDate,
        endDate,
        reason,
      } = req.body


      // PAST DATE VALIDATION
      const today = new Date()

      today.setHours(0, 0, 0, 0)

      const leaveStartDate =
        new Date(startDate)

      leaveStartDate.setHours(
        0, 0, 0, 0
      )

      const diffInTime =
        today.getTime() -
        leaveStartDate.getTime()

      const diffInDays =
        diffInTime /
        (1000 * 60 * 60 * 24)


      if (

        req.user.role !== 'ADMIN' &&

        diffInDays > 7

      ) {

        return res.status(400).json({

          message:
            'Cannot apply leave older than 7 days',
        })
      }



      // HALF DAY
      let deductedDays = 1

      if (
        leaveType === 'HALF_DAY'
      ) {

        deductedDays = 0.5
      }

      else {

        const start =
          new Date(startDate)

        const end =
          new Date(endDate)

        const timeDiff =
          end.getTime() -
          start.getTime()

        deductedDays =
          Math.floor(
            timeDiff /
            (1000 * 60 * 60 * 24)
          ) + 1
      }



      // OVERLAP CHECK
      const overlappingLeave =
        await LeaveRequest.findOne({

          userId:
            req.user.email,

          status: {
            $in: [
              'PENDING',
              'APPROVED',
            ],
          },

          startDate: {
            $lte: endDate,
          },

          endDate: {
            $gte: startDate,
          },
        })


      if (overlappingLeave) {

        return res.status(400).json({

          message:
            'Overlapping leave exists',
        })
      }



      // BALANCE CHECK
      const balance =
        await getLeaveBalance(
          req.user.email
        )


      // WFH BALANCE
      if (
        leaveType === 'WFH'
      ) {

        if (
          balance.WFH.remaining <
          deductedDays
        ) {

          return res.status(400).json({

            message:
              'Insufficient WFH balance',
          })
        }
      }

      // PTO BALANCE
      else {

        if (
          balance.PTO.remaining <
          deductedDays
        ) {

          return res.status(400).json({

            message:
              'Insufficient PTO balance',
          })
        }
      }



      // CREATE LEAVE
      const leave =
        await LeaveRequest.create({

          userId:
            req.user.email,

          leaveType,

          startDate,

          endDate,

          deductedDays,

          reason,
        })



      // AUDIT LOG
      await createAuditLog({

        actorId:
          req.user.email,

        actionType:
          'LEAVE_APPLIED',

        target:
          `${leave.leaveType} leave`,

        reason:
          leave.reason || '',
      })


      res.status(201).json(leave)

    } catch (error) {

      console.log(error)

      res.status(500).json({

        message:
          error.message,
      })
    }
}



// GET MY LEAVES
const getMyLeaves =
  async (req, res) => {

    try {

      const leaves =
        await LeaveRequest.find({

          userId:
            req.user.email,
        })

      res.json(leaves)

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      })
    }
}



// GET PENDING LEAVES
const getPendingLeaves =
  async (req, res) => {

    try {

      const leaves =
        await LeaveRequest.find({

          status: 'PENDING',
        })

      res.json(leaves)

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
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

          message:
            'Leave not found',
        })
      }

      leave.status =
        'APPROVED'

      await leave.save()



      await createAuditLog({

        actorId:
          req.user.email,

        actionType:
          'LEAVE_APPROVED',

        target:
          leave._id.toString(),
      })


      res.json({

        message:
          'Leave approved',
      })

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
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

          message:
            'Leave not found',
        })
      }

      leave.status =
        'REJECTED'

      leave.rejectionReason =
        req.body.reason

      await leave.save()



      await createAuditLog({

        actorId:
          req.user.email,

        actionType:
          'LEAVE_REJECTED',

        target:
          leave._id.toString(),

        reason:
          leave.rejectionReason,
      })


      res.json({

        message:
          'Leave rejected',
      })

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      })
    }
}



// GET BALANCE
const getBalance =
  async (req, res) => {

    try {

      const balance =
        await getLeaveBalance(
          req.user.email
        )

      res.json(balance)

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      })
    }
}



module.exports = {

  applyLeave,

  getMyLeaves,

  getPendingLeaves,

  approveLeave,

  rejectLeave,

  getBalance,
}