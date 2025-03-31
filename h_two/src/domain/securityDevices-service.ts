import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {securityDevicesRouter} from "../routers/securityDevices-router";

export const securityDevicesService = {
    async getActiveSessions(){
        return await securityDevicesDbRepository.getActiveSessions()
    },
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: ObjectId, issuedAt: Date, validUntil: string, userId: ObjectId){
        const activeSessions = await securityDevicesDbRepository.getActiveSessionsByUserId(userId)
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId)
        return 0
    },
    async getActiveSessionsByUserId(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessionsByUserId(userId)
    }

}