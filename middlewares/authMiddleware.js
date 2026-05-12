const jwt = require('jsonwebtoken')

const base = require(
  '../config/airtable'
)

const protect =
  async (req, res, next) => {

    try {

      let token

      if (

        req.headers.authorization &&

        req.headers.authorization.startsWith(
          'Bearer'
        )

      ) {

        token =
          req.headers.authorization.split(
            ' '
          )[1]


        const decoded =
          jwt.verify(

            token,

            process.env.JWT_SECRET
          )


        // FETCH USER FROM AIRTABLE
        const records =
          await base('Team')

          .select({

            filterByFormula:
              `{Email}='${decoded.email}'`

          })

          .firstPage()


        if (!records.length) {

          return res.status(401).json({

            message:
              'Unauthorized',
          })
        }


        const employee =
          records[0].fields


        req.user = {

          email:
            employee.Email,

          name:
            employee.Name,

          role:
            employee.Role,
        }

        next()

      } else {

        res.status(401).json({

          message:
            'No token found',
        })
      }

    } catch (error) {

      res.status(401).json({

        message:
          'Unauthorized',
      })
    }
}

module.exports =
  protect