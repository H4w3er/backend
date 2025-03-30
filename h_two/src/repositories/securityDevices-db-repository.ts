import {refreshTokenCollection} from "../db/mongo-db";
import {refreshTokenDb} from "../db/refresh-Token-db";
import {ObjectId} from "mongodb";

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
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: string, issuedAt: Date, validUntil: string, userId:ObjectId){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId})
        //console.log(await refreshTokenCollection.find({}).toArray() as any[])
        return 0
    },
    async getActiveSessionsByUserId(userId : ObjectId){
        const activeSession = await refreshTokenCollection.find({userId: userId}).toArray() as any//Array<refreshTokenDb>
        //const validActiveSession = activeSession.filter((session: { issuedAt: { getSeconds: () => any; }; }) => (session.issuedAt.getSeconds()) < (new Date().getSeconds()))
        return activeSession;
    }
}