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



      // =================================
      // DEVELOPMENT BYPASS
      // REMOVE BEFORE FINAL SUBMISSION
      // =================================

      if (

        email ===
        'tusharbhakat39@gmail.com'

      ) {

        const user = {

          name,

          email,

          role: 'ADMIN',
        }


        const jwtToken =
          generateToken(email)


        return res.json({

          token: jwtToken,

          user,
        })
      }



      // =================================
      // AIRTABLE AUTH
      // =================================

      const records =
        await base(
          process.env
            .AIRTABLE_TABLE_NAME
        )

        .select({

          filterByFormula:
            `{Email}='${email}'`

        })

        .firstPage()



      // USER NOT FOUND
      if (!records.length) {

        return res.status(403).json({

          message:
            'Access denied. Not part of RISE team.',
        })
      }



      // USER FOUND
      const employee =
        records[0].fields


      const user = {

        name:
          employee.Name || name,

        email:
          employee.Email || email,

        role:
          employee.Role || 'MEMBER',
      }


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