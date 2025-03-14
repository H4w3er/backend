import {UserDbType} from "../db/user-type-db";
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(id: ObjectId){
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET,{expiresIn: '10 seconds'})
        return token
    },
    async getIdByToken(token: string | undefined){
        try{
            const jwt = require('jsonwebtoken')
            const result = jwt.verify(token, SETTINGS.JWT_SECRET)
            //console.log(result)
            return result.userId
        } catch (error){
            console.log(error)
            return null
        }
    },
    async createRefreshToken(id: ObjectId){
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET,{expiresIn: '20 minutes'})
        return token
    }
}