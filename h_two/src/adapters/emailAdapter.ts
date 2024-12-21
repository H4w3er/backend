import nodemailer from "nodemailer";
import {SETTINGS} from "../settings";

export const emailAdapter = {
    async sendEmail(email: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: "mr.gavrik378@list.ru",
                pass: SETTINGS.EMAIL_PASS,
            },
        });
        const info = await transporter.sendMail({
            from: '"Artem"<mr.gavrik378@list.ru>',
            to: email,
            subject: 'account creation',
            html: '<h1>Thanks for your registration</h1>\n <p>To finish registration please follow the link below:\n  <a href=\'https://somesite.com/confirm-email?code=your_confirmation_code\'>complete registration</a>\n </p>'
        });
    }
}