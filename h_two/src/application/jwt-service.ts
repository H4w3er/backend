import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(id: ObjectId) {
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '10 seconds'})
        return token
    },
    async getIdByToken(token: string | undefined) {
        try {
            const jwt = require('jsonwebtoken')
            const result = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async getDeviceIdByToken(token: string | undefined){
        try {
            const jwt = require('jsonwebtoken')
            const result = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.deviceId
        } catch (error) {
            return null
        }
    },
    async createRefreshToken(id: ObjectId, acceptedDeviceId: string | string[] | undefined) {
        const jwt = require('jsonwebtoken')
        if (acceptedDeviceId!=undefined) {
            acceptedDeviceId = acceptedDeviceId.toString()
            const token = jwt.sign({userId: id, deviceId: acceptedDeviceId}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'})
            return {
                token: token,
                deviceId: acceptedDeviceId
            }
        } else {
            const deviceId = new ObjectId()
            const token = jwt.sign({userId: id, deviceId: deviceId}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'})
            return {
                token: token,
                deviceId: deviceId
            }
        }
    }
}