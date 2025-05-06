import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class JwtService {
    async createJWT(id: ObjectId) {
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '10 minutes'})
        return token
    }
    async getIdFromToken(token: string) {
        try {
            const jwt = require('jsonwebtoken')
            const result = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result
        } catch (error) {
            return {
                userId: null,
                deviceId: null
            }
        }
    }
    async createRefreshToken(id: ObjectId, acceptedDeviceId: string | null) {
        const jwt = require('jsonwebtoken')
        if (acceptedDeviceId!=null) {
            acceptedDeviceId = acceptedDeviceId.toString()
            const token = jwt.sign({userId: id, deviceId: acceptedDeviceId}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'})
            return {
                token: token,
                deviceId: acceptedDeviceId
            }
        } else {
            const deviceId = new ObjectId()
            const token = jwt.sign({userId: id, deviceId: deviceId.toString()}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'})
            return {
                token: token,
                deviceId: deviceId
            }
        }
    }
}