const express = require('express')

const router = express.Router()

const LeaveRequest = require(
  '../models/LeaveRequest'
)

const User = require(
  '../models/User'
)

router.get('/summary', async (req, res) => {

  try {

    const totalEmployees =
      await User.countDocuments()

    const pendingLeaves =
      await LeaveRequest.countDocuments({
        status: 'PENDING',
      })

    const approvedLeaves =
      await LeaveRequest.countDocuments({
        status: 'APPROVED',
      })

    const rejectedLeaves =
      await LeaveRequest.countDocuments({
        status: 'REJECTED',
      })

    res.json({

      totalEmployees,

      pendingLeaves,

      approvedLeaves,

      rejectedLeaves,
    })

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router