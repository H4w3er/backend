import {securityDevicesDbRepository} from "../repositories/securityDevices-db-repository";

export const securityDevicesService = {
    async getActiveSessions(){
        return await securityDevicesDbRepository.getActiveSessions()
    },
    async addNewSession(ip:string, title: string|undefined, lastActiveDate: string, deviceId: string, issuedAt: Date, validUntil: string){
        await securityDevicesDbRepository.addNewSession(ip, title, lastActiveDate, deviceId, issuedAt, validUntil)
        return 0
    }
}