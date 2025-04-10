import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";

export const securityDevicesService = {
    async getActiveSessions(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessions(userId)
    },
    async addNewSession(ip:string, title: string | undefined, lastActiveDate: string, deviceId: string, issuedAt: Date, validUntil: Date, userId: ObjectId, refreshToken: string){
        const activeSessions = await securityDevicesDbRepository.getSessionsByUserId(userId)
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken)
        return 0
    },
    async getActiveSessionsByUserId(userId: ObjectId){
        return await securityDevicesDbRepository.getSessionsByUserId(userId)
    },
    async deleteAllOther(userId: ObjectId, deviceId: string){
        await securityDevicesDbRepository.deleteAllOther(userId, deviceId)
        return 0
    },
    async deleteSessionByDeviceId(deviceId: string, userId: ObjectId){
        const session = await securityDevicesDbRepository.getSessionsByDeviceId(deviceId)
        if (!session) return 1
        else if (session?.userId!=userId) return 0
        else {
            const deleted = await securityDevicesDbRepository.deleteSessionByDeviceId(deviceId)
            if (deleted.deletedCount === 0) return 1
            else {
                await usersService.addToBlackListAnother(session.refreshToken, session.userId)
                return 2
            }
        }
    },
    async sessionUpdate(userId: ObjectId, deviceId: string, refreshToken: string){
        await securityDevicesDbRepository.sessionUpdate(userId, deviceId, refreshToken)
        return 0
    }
}