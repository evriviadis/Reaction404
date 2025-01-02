import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

export async function sendEmail(option){
    //CREATE TRANSPORTER
    const transport = nodemailer.createTransport({
        name: "api.worldthreesixty.com",
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
          user: "no-reply@worldthreesixty.com",
          pass: "jarqiq-7vupgy-Sovnub"
        }
      });
    // DEFINE EMAIL OPTIONS 
    const email_options = {
        from: 'W360 Support<no-reply@worldthreesixty.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    };

    await transport.sendMail(email_options); 
} 