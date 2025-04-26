import {UsersDbRepository} from "../repositories/users-db-repository";
import {UserDbTypeCommon} from "../db/user-type-db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import {EmailAdapter} from "../adapters/emailAdapter";
import {injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(protected usersDbRepository: UsersDbRepository,
                protected emailAdapter: EmailAdapter) {    }

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
            const error: object = {"errorsMessages":[
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
                confCode: uuidv4(),
                isConfirmed: false
            },
            []
    )
        await this.emailAdapter.sendEmail(email, newUser.emailConfirm.confCode)
        return this.usersDbRepository.createUser(newUser)
    }
    async createHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }
    async sendConfirmationLetter(email: string){
        const user = await this.usersDbRepository.findByLoginOrEmail(email)
        if (!user){
            return null
        }
        if (user.emailConfirm.isConfirmed) return null
        const newCode = await this.usersDbRepository.updateUserCodeByCode(user.emailConfirm.confCode)
        await this.emailAdapter.sendEmail(email, newCode)
        return true
    }
}