const LeaveRequest = require(
  '../models/LeaveRequest'
)

const getCalendarLeaves =
  async (req, res) => {

    try {

      const leaves =
        await LeaveRequest.find({

          status: 'APPROVED',
        })


      const events =
        leaves.map((leave) => ({

          title:
            `${leave.userEmail} - ${leave.leaveType}`,

          start:
            leave.startDate,

          end:
            leave.endDate,
        }))


      res.json(events)

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      })
    }
}

module.exports = {
  getCalendarLeaves,
}