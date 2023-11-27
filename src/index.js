require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./routes/route')
const Sentry = require('@sentry/node')
const cookieparser = require('cookie-parser')

const sentryDsn = process.env.SENTRY_DSN
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use('/api/v1/', router)

Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
})

app.listen(port, () => {
    console.log(`Server is running on port :${port}`)
})
