import {UserDbType} from "../db/user-type-db";
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(user: UserDbType){
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET,{expiresIn: '10 seconds'})
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
    },
    async createRefreshToken(user: UserDbType){
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET,{expiresIn: '20 seconds'})
        return token
    }
}