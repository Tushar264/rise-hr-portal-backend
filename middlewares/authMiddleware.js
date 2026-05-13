const jwt = require('jsonwebtoken')

const base = require(
  '../config/airtable'
)

const protect =
  async (req, res, next) => {

    try {

      let token

      // CHECK TOKEN
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

      }


      if (!token) {

        return res.status(401).json({

          message:
            'No token found',
        })
      }


      // VERIFY JWT
      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET
        )


      console.log(
        'Decoded JWT:',
        decoded
      )


      // FETCH USER FROM AIRTABLE
      const records =
        await base(
          process.env
            .AIRTABLE_TABLE_NAME
        )

        .select({

          filterByFormula:
            `{Email ID}='${decoded.email}'`

        })

        .firstPage()


      console.log(
        'Airtable Records:',
        records
      )


      if (!records.length) {

        return res.status(401).json({

          message:
            'Unauthorized',
        })
      }


      const employee =
        records[0].fields

        console.log(employee)
      // ATTACH USER
      req.user = {

        email:
          employee['Email ID'],

        name:
          employee.Name,

        role:
          employee.Role,
      }


      console.log(
        'Authenticated User:',
        req.user
      )


      next()

    } catch (error) {

      console.log(
        'Auth Middleware Error:',
        error
      )

      res.status(401).json({

        message:
          'Unauthorized',
      })
    }
}

module.exports =
  protect