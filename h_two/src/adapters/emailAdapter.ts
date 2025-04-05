import nodemailer from "nodemailer";
import {SETTINGS} from "../settings";
import {usersRepository} from "../repositories/users-db-repository";

export const emailAdapter = {
    async sendEmail(email: string, code: string) {
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
            subject: 'Account creation',
            text: `https://somesite.com/confirm-email?code=${code}`
        });
    },
    async checkCode(code: string){
        const user = await usersRepository.findUserByCode(code)
        //console.log(user)
        if (user?.emailConfirm.isConfirmed === false) {
            await usersRepository.updateUserByCode(code)
            return true
        } else return false
    }
}