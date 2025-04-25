import {UsersDbRepository} from "../repositories/users-db-repository";
import {UserDbTypeCommon} from "../db/user-type-db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'

export class UsersService{
    usersDbRepository: UsersDbRepository
    constructor() {
        this.usersDbRepository = new UsersDbRepository()
    }
    async createUser(login: string, password: string, email: string) {
        if (await this.usersDbRepository.findByLoginOrEmail(login)){
            const error: object = {"errorsMessages": [
                    {
                        "message": "the login is not unique",
                        "field": "login"
                    }]}
            return error
        }
        if (await this.usersDbRepository.findByLoginOrEmail(email)){
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
        return this.usersDbRepository.createUser(newUser)
    }
    async deleteUser(id: string): Promise<boolean> {
        return this.usersDbRepository.deleteUser(id)
    }
    async checkCredentials(loginOrEmail: string, password: string){
        const user = await this.usersDbRepository.findByLoginOrEmail(loginOrEmail)
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
        return this.usersDbRepository.findUserById(id)
    }
    async isTokenAllowed(refreshToken: string, userId: string){
        const user = await this.usersDbRepository.findUserById(userId)
        if (!user) return false
        if (user?.refreshTokenBlackList.includes(refreshToken)){
            return false
        }
        return true
    }
    async addToBlackList(refreshToken: string, userId: string){
        await this.usersDbRepository.addToBlackList(refreshToken, userId)
        return 0
    }
    async addToBlackListAnother(refreshToken: string, userId: ObjectId){
        await this.usersDbRepository.addToBlackList(refreshToken, userId)
        return 0
    }
}