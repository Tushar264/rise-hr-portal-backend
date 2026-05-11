const express = require('express')

const router = express.Router()

const protect = require(
  '../middlewares/authMiddleware'
)

const adminOnly = require(
  '../middlewares/adminMiddleware'
)

const {
  getAuditLogs,
} = require(
  '../controllers/auditController'
)

router.get(
  '/',
  protect,
  adminOnly,
  getAuditLogs
)

module.exports = router