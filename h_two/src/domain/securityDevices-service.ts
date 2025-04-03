import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {securityDevicesRouter} from "../routers/securityDevices-router";

export const securityDevicesService = {
    async getActiveSessions(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessions(userId)
    },
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: ObjectId, issuedAt: Date, validUntil: Date, userId: ObjectId){
        const activeSessions = await securityDevicesDbRepository.getActiveSessionsByUserId(userId)
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId)
        return 0
    },
    async getActiveSessionsByUserId(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessionsByUserId(userId)
    },
    async deleteAllOther(userId: ObjectId, deviceId: ObjectId){
        await securityDevicesDbRepository.deleteAllOther(userId, deviceId)
        return 0
    }

}