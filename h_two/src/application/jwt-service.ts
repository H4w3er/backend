import {UserDbType} from "../db/user-type-db";
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";
import {securityDevicesService} from "../domain/securityDevices-service";

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
    async createRefreshToken(id: ObjectId, acceptedDeviceId: string | string[] | undefined) {
        const jwt = require('jsonwebtoken')
        if (acceptedDeviceId!=undefined) {
            acceptedDeviceId = acceptedDeviceId.toString()
            const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'}, {deviceId: acceptedDeviceId})
            return {
                token: token,
                deviceId: acceptedDeviceId
            }
        } else {
            const deviceId = new ObjectId()
            const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'}, {deviceId: deviceId})
            return {
                token: token,
                deviceId: deviceId
            }
        }
    }
}