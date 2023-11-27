const nodemailer = require('nodemailer')
const { SERVICE, MAIL_SMTP, PASS_SMTP, SENDER } = process.env

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
        html: `
        <p>Hii👋, welcome to Binar Academy!</p>
        <p>Congratulations on becoming a part of our community. To activate your account, please click the link below:</p>
        <a href="${activationLink}">Activate Your Account</a>
        <p>If you did not sign up for Binar Academy, you can safely ignore this email.</p>
        <p>Thank you, and we hope you have a fantastic experience with Binar Academy!</p>        
        `,
    }
    
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Welcome email sent response : ' + info.response)
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
        html: `
        <p>Hii👋, Congratulations your account is verified! </p>
        <p>Thank you, and we hope you have a fantastic experience with Binar Academy!</p>        
        `,
    }
    
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Welcome email sent response : ' + info.response)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

module.exports = { UserActivation, NotifActivation }
