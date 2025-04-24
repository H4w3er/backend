import {usersRepository} from "../repositories/users-db-repository";
import {UserDbTypeCommon} from "../db/user-type-db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'

class UsersService{
    async createUser(login: string, password: string, email: string) {
        if (await usersRepository.findByLoginOrEmail(login)){
            const error: object = {"errorsMessages": [
                    {
                        "message": "the login is not unique",
                        "field": "login"
                    }]}
            return error
        }
        if (await usersRepository.findByLoginOrEmail(email)){
            const error: object = {
                "errorsMessages": [
                    {
                        "message": "the email address is not unique",
                        "field": "email"
                    }]}
            return error
        }
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.createHash(password, passwordSalt)
        const newUser = new UserDbTypeCommon(
            new ObjectId(),
            login,
            email,
            passwordHash,
            passwordSalt,
            new Date().toISOString(),
            {
                confCode: '1',
                isConfirmed: true
            },
            []
    )
        return usersRepository.createUser(newUser)
    }
    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    }
    async checkCredentials(loginOrEmail: string, password: string){
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this.createHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash){
            return false
        }
        return user;
    }
    async createHash(password: string, salt: string){
        const bcrypt = require('bcrypt')
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }
    async findUserById(id: string){
        return usersRepository.findUserById(id)
    }
    async isTokenAllowed(refreshToken: string, userId: string){
        const user = await usersRepository.findUserById(userId)
        if (!user) return false
        if (user?.refreshTokenBlackList.includes(refreshToken)){
            return false
        }
        return true
    }
    async addToBlackList(refreshToken: string, userId: string){
        await usersRepository.addToBlackList(refreshToken, userId)
        return 0
    }
    async addToBlackListAnother(refreshToken: string, userId: ObjectId){
        await usersRepository.addToBlackList(refreshToken, userId)
        return 0
    }
}

export const usersService = new UsersService()