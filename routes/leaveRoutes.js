const express = require('express')

const router = express.Router()

const protect = require(
  '../middlewares/authMiddleware'
)

const adminOnly = require(
  '../middlewares/adminMiddleware'
)

const {

  applyLeave,

  getMyLeaves,

  getPendingLeaves,

  approveLeave,

  rejectLeave,

  getBalance,

} = require(
  '../controllers/leaveController'
)


// APPLY LEAVE
router.post(
  '/',
  protect,
  applyLeave
)


// GET MY LEAVES
router.get(
  '/my-leaves',
  protect,
  getMyLeaves
)


// GET PENDING LEAVES
router.get(
  '/pending',
  protect,
  adminOnly,
  getPendingLeaves
)


// APPROVE LEAVE
router.put(
  '/approve/:id',
  protect,
  adminOnly,
  approveLeave
)


// REJECT LEAVE
router.put(
  '/reject/:id',
  protect,
  adminOnly,
  rejectLeave
)


router.get(
  '/balance',
  protect,
  getBalance
)


module.exports = router