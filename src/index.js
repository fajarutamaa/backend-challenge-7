require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./routes/route')
const Sentry = require('@sentry/node')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const sentryDsn = process.env.SENTRY_DSN
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use('/api/v1/', router)


io.on('connection', (socket) => {

    console.log(`⚡: ${socket.id} user just connected`)
    
    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })

    socket.on('notification', (data) => {
        io.to(socket.id).emit('updateNotification', { message: 'Password updated successfully!' })
    })
})

Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
})

http.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})


