const { OAuth2Client } =
  require('google-auth-library')

const base = require(
  '../config/airtable'
)

const generateToken = require(
  '../utils/generateToken'
)

const client =
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  )



const googleLogin =
  async (req, res) => {

    try {

      const { token } = req.body


      // VERIFY GOOGLE TOKEN
      const ticket =
        await client.verifyIdToken({

          idToken: token,

          audience:
            process.env.GOOGLE_CLIENT_ID,
        })

      const payload =
        ticket.getPayload()

      const email =
        payload.email

      const name =
        payload.name


      // CHECK AIRTABLE
      const records =
        await base(
          process.env
            .AIRTABLE_TABLE_NAME
        )

        .select({

          filterByFormula:
            `{Email ID}='${email}'`

        })

        .firstPage()


      // USER NOT FOUND
      if (!records.length) {

        return res.status(403).json({

          message:
            'Access denied. Not part of RISE team.',
        })
      }


      const employee =
        records[0].fields

        console.log(employee)

      const user = {

        name,

        email,

        role:
          employee.Role || 'MEMBER',
      }


      // GENERATE JWT
      const jwtToken =
        generateToken(email)


      res.json({

        token: jwtToken,

        user,
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({

        message:
          error.message,
      })
    }
}

module.exports = {
  googleLogin,
}