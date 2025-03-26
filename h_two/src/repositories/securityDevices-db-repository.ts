import {refreshTokenCollection} from "../db/mongo-db";

const sessionsMapper = async (value: Array<any>) => {
    const mappedSessions = value.map(session => {
        session = {
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
        }
        return session
    })
    return mappedSessions
}

export const securityDevicesDbRepository={
    async getActiveSessions() {
        const sessions = await refreshTokenCollection.find({}).toArray() as any[];
        return sessionsMapper(sessions)
    },
    async addNewSession(ip:string, title: string|undefined, lastActiveDate: string, deviceId: string, issuedAt: string, validUntil: string){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil})
        console.log(await refreshTokenCollection.find({}).toArray() as any[])
        return 0
    }
}