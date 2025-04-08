import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";

export const securityDevicesService = {
    async getActiveSessions(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessions(userId)
    },
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: ObjectId, issuedAt: Date, validUntil: Date, userId: ObjectId, refreshToken: string){
        const activeSessions = await securityDevicesDbRepository.getSessionsByUserId(userId)
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken)
        return 0
    },
    async getActiveSessionsByUserId(userId: ObjectId){
        return await securityDevicesDbRepository.getSessionsByUserId(userId)
    },
    async deleteAllOther(userId: ObjectId, deviceId: ObjectId){
        await securityDevicesDbRepository.deleteAllOther(userId, deviceId)
        return 0
    },
    async deleteSessionByDeviceId(deviceId: string, userId: ObjectId){
        try {
            const session = await securityDevicesDbRepository.getSessionsByDeviceId(new ObjectId(deviceId))
        } catch (er){
            return 1
        }
        const session = await securityDevicesDbRepository.getSessionsByDeviceId(new ObjectId(deviceId))
        if (!session) return 1
        else if (session?.userId!=userId) return 0
        else {
            const deleted = await securityDevicesDbRepository.deleteSessionByDeviceId(new ObjectId(deviceId))
            if (deleted.deletedCount === 0) return 1
            else {
                await usersService.addToBlackListAnother(session.refreshToken, session.userId)
                return 2
            }
        }
    },
    async sessionUpdate(userId: ObjectId, deviceId: ObjectId, refreshToken: string){
        await securityDevicesDbRepository.sessionUpdate(userId, deviceId, refreshToken)
        return 0
    }
}