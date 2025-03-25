import {refreshTokenCollection} from "../db/mongo-db";

export const securityDevicesDbRepository={
    async getActiveSessions() {
        const sessions = await refreshTokenCollection.find();
        return sessions
    },
    async addNewSession(ip:string, title: string, lastActiveDate: string, deviceId: string, issuedAt: string, validUntil: string){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil})
        return 0
    }
}