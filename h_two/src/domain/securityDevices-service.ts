import {SecurityDevicesDbRepository} from "../repositories/securityDevices-db-repository";
import {ObjectId} from "mongodb";
import {UsersService} from "./users-service";
import {injectable} from "inversify";

@injectable()
export class SecurityDevicesService {
    constructor(protected securityDevicesDbRepository: SecurityDevicesDbRepository,
                protected usersService: UsersService) {
    }

    async getActiveSessions(userId: ObjectId){
        return await this.securityDevicesDbRepository.getActiveSessions(userId)
    }
    async addNewSession(ip:string, title: string = 'noTitle', deviceId: string, userId: ObjectId, refreshToken: string){
        const issuedAt = new Date()
        const lastActiveDate = new Date().toISOString()
        const validUntil = new Date(new Date().setSeconds(new Date().getSeconds() + 20))
        await this.securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken)
    }
    async deleteAllOther(userId: string, deviceId: string){
        const otherSessions = await this.securityDevicesDbRepository.getSessionsByUserId(userId)
        for (let i = 0; i<otherSessions.length; i++){
            if (otherSessions[i].deviceId != deviceId) {
                await this.usersService.addToBlackListAnother(otherSessions[i].refreshToken, otherSessions[i].userId)
            }
        }
        await this.securityDevicesDbRepository.deleteAllOther(userId, deviceId)
    }
    async deleteSessionByDeviceId(deviceId: string, userId: ObjectId){
        const session = await this.securityDevicesDbRepository.getSessionsByDeviceId(deviceId)
        if (!session) return 'notFound'
        else if (session?.userId!=userId) return 'accessRejected'
        else {
            const deleted = await this.securityDevicesDbRepository.deleteSessionByDeviceId(deviceId)
            if (deleted.deletedCount === 0) return 'notFound'
            else {
                await this.usersService.addToBlackListAnother(session.refreshToken, session.userId)
                return 'successDelete'
            }
        }
    }
    async sessionUpdate(userId: ObjectId, deviceId: string, refreshToken: string){
        const date = new Date().toISOString()
        await this.securityDevicesDbRepository.sessionUpdate(userId, deviceId, refreshToken, date)
    }
}