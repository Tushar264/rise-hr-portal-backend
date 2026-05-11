const cron = require('node-cron')

const nodemailer = require('nodemailer')

const LeaveRequest = require(
  '../models/LeaveRequest'
)

cron.schedule(
  '0 9 * * 1-6',

  async () => {

    try {

      const today =
        new Date()

      const leaves =
        await LeaveRequest.find({

          status: 'APPROVED',
        }).populate('userId')


      const transporter =
        nodemailer.createTransport({

          service: 'gmail',

          auth: {
            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,
          },
        })


      let html =
        '<h1>Who is out today</h1>'


      leaves.forEach((leave) => {

        html += `
          <p>
            ${leave.userId.name}
            -
            ${leave.leaveType}
          </p>
        `
      })


      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          process.env.EMAIL_USER,

        subject:
          "Who's out today",

        html,
      })


      console.log(
        'Daily digest sent'
      )

    } catch (error) {

      console.log(error)
    }
  }
)