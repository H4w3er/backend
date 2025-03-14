import {usersRepository} from "../repositories/users-db-repository";
import {UserDbType} from "../db/user-type-db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'


export const usersService = {
    async createUser(login: string, password: string, email: string) {
        if (await usersRepository.findByLoginOrEmail(login)){
            return 1
        }
        if (await usersRepository.findByLoginOrEmail(email)){
            return 2
        }
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.createHash(password, passwordSalt)
        const newUser:UserDbType = {
            _id: new ObjectId(),
            userName: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string){
         const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
         const passwordHash = await this.createHash(password, user.passwordSalt)
         if (user.passwordHash !== passwordHash){
             return false
         }
         return user;
    },
    async createHash(password: string, salt: string){
        const bcrypt = require('bcrypt')
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },
    async findUserById(id: string){
        return usersRepository.findUserById(id)
    },
    async isTokenAllowed(refreshToken: string, userId: string){
        const user = await usersRepository.findUserById(userId)
        if (!user) return false
        if (user?.refreshTokenBlackList.includes(refreshToken)){
            return false
        }
        return true
    },
    async addToBlackList(refreshToken: string, userId: string){
        await usersRepository.addToBlackList(refreshToken, userId)
    }
}