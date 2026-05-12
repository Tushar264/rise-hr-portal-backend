const LeaveRequest = require(
  '../models/LeaveRequest'
)

const getLeaveBalance =
  async (userId) => {

    const approvedLeaves =
      await LeaveRequest.find({

        userId,

        status: 'APPROVED',
      })


    let ptoUsed = 0

    let wfhUsed = 0


    approvedLeaves.forEach((leave) => {

      if (
        leave.leaveType === 'WFH'
      ) {

        wfhUsed +=
          leave.deductedDays

      } else {

        ptoUsed +=
          leave.deductedDays
      }
    })


    return {

      PTO: {
        total: 20,
        used: ptoUsed,
        remaining:
          20 - ptoUsed,
      },

      WFH: {
        total: 20,
        used: wfhUsed,
        remaining:
          20 - wfhUsed,
      },
    }
}

module.exports =
  getLeaveBalance