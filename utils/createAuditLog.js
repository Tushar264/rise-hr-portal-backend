const AuditLog = require(
  '../models/AuditLog'
)

const createAuditLog =
  async ({
    actorId,
    actionType,
    target,
    reason = '',
  }) => {

    try {

      await AuditLog.create({

        actorId,

        actionType,

        target,

        reason,
      })

    } catch (error) {

      console.log(
        'Audit log failed:',
        error.message
      )
    }
}

module.exports = createAuditLog