const Announcement = require(
  '../models/Announcement'
)

const Reply = require(
  '../models/Reply'
)

const Reaction = require(
  '../models/Reaction'
)



// CREATE POST
const createAnnouncement =
  async (req, res) => {

    try {

      const {
        title,
        body,
      } = req.body

      const post =
        await Announcement.create({

          title,

          body,

          authorId: req.user._id,
        })

      res.status(201).json(post)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// GET POSTS
const getAnnouncements =
  async (req, res) => {

    try {

      const posts =
        await Announcement.find()

        .populate('authorId')

        .sort({
          createdAt: -1,
        })

      res.json(posts)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// CREATE REPLY
const createReply =
  async (req, res) => {

    try {

      const {
        announcementId,
        body,
        parentReplyId,
      } = req.body

      const reply =
        await Reply.create({

          announcementId,

          body,

          parentReplyId:
            parentReplyId || null,

          authorId:
            req.user._id,
        })

      res.status(201).json(reply)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// GET REPLIES
const getReplies =
  async (req, res) => {

    try {

      const replies =
        await Reply.find({

          announcementId:
            req.params.id

        })

        .populate('authorId')

        .sort({
          createdAt: 1,
        })

      res.json(replies)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



// REACT TO POST/REPLY
const reactToTarget =
  async (req, res) => {

    try {

      const {
        targetId,
        targetType,
        reaction,
      } = req.body

      const existingReaction =
        await Reaction.findOne({

          userId: req.user._id, 

          targetId,

          targetType,

          reaction,
        })

      // TOGGLE REACTION
      if (existingReaction) {

        await existingReaction.deleteOne()

        return res.json({
          message:
            'Reaction removed',
        })
      }

      const newReaction =
        await Reaction.create({

          userId: req.user._id,

          targetId,

          targetType,

          reaction,
        })

      res.json(newReaction)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
}



module.exports = {

  createAnnouncement,

  getAnnouncements,

  createReply,

  getReplies,

  reactToTarget,
}