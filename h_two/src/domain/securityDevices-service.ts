import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";

export const securityDevicesService = {
    async getActiveSessions(userId: ObjectId){
        return await securityDevicesDbRepository.getActiveSessions(userId)
    },
    async addNewSession(ip:string, title: string = 'noTitle', deviceId: string, userId: ObjectId, refreshToken: string){
        const issuedAt = new Date()
        const lastActiveDate = new Date().toISOString()
        const validUntil = new Date(new Date().setSeconds(new Date().getSeconds() + 20))
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken)
    },
    async deleteAllOther(userId: string, deviceId: string){
        const otherSessions = await securityDevicesDbRepository.getSessionsByUserId(userId)
        for (let i = 0; i<otherSessions.length; i++){
            if (otherSessions[i].deviceId != deviceId) {
                await usersService.addToBlackListAnother(otherSessions[i].refreshToken, otherSessions[i].userId)
            }
        }
        await securityDevicesDbRepository.deleteAllOther(userId, deviceId)
    },
    async deleteSessionByDeviceId(deviceId: string, userId: ObjectId){
        const session = await securityDevicesDbRepository.getSessionsByDeviceId(deviceId)
        if (!session) return 'notFound'
        else if (session?.userId!=userId) return 'accessRejected'
        else {
            const deleted = await securityDevicesDbRepository.deleteSessionByDeviceId(deviceId)
            if (deleted.deletedCount === 0) return 'notFound'
            else {
                await usersService.addToBlackListAnother(session.refreshToken, session.userId)
                return 'successDelete'
            }
        }
    },
    async sessionUpdate(userId: ObjectId, deviceId: string, refreshToken: string){
        await securityDevicesDbRepository.sessionUpdate(userId, deviceId, refreshToken)
    }
}