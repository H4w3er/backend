import {usersRepository} from "../repositories/users-db-repository";
import {UserDbTypeCommon} from "../db/user-type-db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import {emailAdapter} from "../adapters/emailAdapter";

export const authService = {
    async createUser(login: string, password: string, email: string) {
        if (await usersRepository.findByLoginOrEmail(login)){
            return 1
        }
        if (await usersRepository.findByLoginOrEmail(email)){
            return 2
        }
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.createHash(password, passwordSalt)
        const newUser:UserDbTypeCommon = {
            _id: new ObjectId(),
            userName: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            emailConfirm:{
                confCode: uuidv4(),
                isConfirmed: false
            },
            refreshTokenBlackList: []
        }
        await emailAdapter.sendEmail(email, newUser.emailConfirm.confCode)
        return usersRepository.createUser(newUser)
    },
    async createHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },
    async sendConfirmationLetter(email: string){
        const user = await usersRepository.findByLoginOrEmail(email)
        if (!user){
            return null
        }
        if (user.emailConfirm.isConfirmed) return null
        const newCode = await usersRepository.updateUserCodeByCode(user.emailConfirm.confCode)
        await emailAdapter.sendEmail(email, newCode)
        return true
    }
}