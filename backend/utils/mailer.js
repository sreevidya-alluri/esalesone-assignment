import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load .env variables once when this module is imported
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  secure: false, 
  tls: {
    rejectUnauthorized: false
  }
})

export default transporter
