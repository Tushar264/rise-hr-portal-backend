const express = require('express')

const router = express.Router()

const protect = require(
  '../middlewares/authMiddleware'
)

const {

  createAnnouncement,

  getAnnouncements,

  createReply,

  getReplies,

  reactToTarget,

} = require(
  '../controllers/announcementController'
)



// POSTS
router.post(
  '/',
  protect,
  createAnnouncement
)

router.get(
  '/',
  protect,
  getAnnouncements
)


// REPLIES
router.post(
  '/reply',
  protect,
  createReply
)

router.get(
  '/reply/:id',
  protect,
  getReplies
)


// REACTIONS
router.post(
  '/react',
  protect,
  reactToTarget
)


module.exports = router