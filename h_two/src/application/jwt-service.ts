import {UserDbType} from "../db/user-type-db";
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";
import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";

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
    async createRefreshToken(id: ObjectId, deviceName: string | undefined) {
        const activeSession = await securityDevicesDbRepository.getActiveSessionsByUserId(id)
        const activeSessionCount = activeSession.length
        const jwt = require('jsonwebtoken')
        /*if (activeSessionCount > 0) {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'}, {deviceId: activeSession[activeSessionCount - 1].deviceId + 1})
        return {
            token: token,
            deviceId: activeSession[activeSessionCount - 1].deviceId + 1
        }
    } else {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'}, {deviceId: 1})
        return {
            token: token,
            deviceId: 1
        }
    }*/
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '20 seconds'}, {deviceId: 1})
        return {
            token: token,
            deviceId: '1'
        }
    }
}