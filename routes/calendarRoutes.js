const express = require('express')

const router = express.Router()

const LeaveRequest = require(
  '../models/LeaveRequest'
)

const Holiday = require(
  '../models/Holiday'
)

router.get('/', async (req, res) => {

  const leaves =
    await LeaveRequest.find({
      status: 'APPROVED',
    }).populate('userId')

  const holidays =
    await Holiday.find()

  res.json({
    leaves,
    holidays,
  })
})

module.exports = router