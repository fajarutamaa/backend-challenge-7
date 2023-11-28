const nodemailer = require('nodemailer')
const { SERVICE, MAIL_SMTP, PASS_SMTP, SENDER } = process.env
const { templateReset, templateWelcome, templateNotif } = require('../templates/template.html.js')

const transporter = nodemailer.createTransport({
    service: SERVICE,
    port: 465,
    secure: true,
    auth: {
        user: MAIL_SMTP,
        pass: PASS_SMTP
    }
})

async function UserActivation(email, activationLink) {

    const mailOptions = {
        from: SENDER,
        to: email,
        subject: 'Welcome 🚀 - Verify Your Account',
        html: templateWelcome(activationLink)
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('response : ' + info.response)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

async function NotifActivation(email) {

    const mailOptions = {
        from: SENDER,
        to: email,
        subject: 'Congratulations ✨ - Verify Your Account Successfully',
        html: templateNotif()
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('response : ' + info.response)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

async function SendResetEmail(email, resetLink) {

    const mailOptions = {
        from: SENDER,
        to: email,
        subject: 'Information 🔔 - Reset Your Password Account',
        html: templateReset(resetLink),
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('response : ' + info.response)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}


module.exports = { UserActivation, NotifActivation, SendResetEmail }
