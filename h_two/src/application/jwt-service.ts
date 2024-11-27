import {UserDbType} from "../db/user-type-db";
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: UserDbType){
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET,{expiresIn: '5 days'})
        return token
    },
    async getIdByToken(token: string | undefined){
        try{
            const jwt = require('jsonwebtoken')
            const result = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId
        } catch (error){
            return null
        }
    }
}