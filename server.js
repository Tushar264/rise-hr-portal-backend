const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')


dotenv.config()

require('./cron/dailyDigest')

const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/leave', require('./routes/leaveRoutes'))
app.use('/api/calendar', require('./routes/calendarRoutes'))
app.use('/api/announcement', require('./routes/announcementRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/audit', require('./routes/auditRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))

const PORT =
  process.env.PORT || 5000

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  )
})