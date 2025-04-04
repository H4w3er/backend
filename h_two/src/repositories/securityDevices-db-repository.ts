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
    async getActiveSessions(userId: ObjectId) {
        const sessions = await refreshTokenCollection.find({userId: new ObjectId(userId)}).toArray() as any[];
        const activeSessions = sessions.filter(session => session.validUntil >  new Date()
        )
        return sessionsMapper(activeSessions)
    },
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: ObjectId, issuedAt: Date, validUntil: Date, userId:ObjectId){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId})
        //console.log(await refreshTokenCollection.find({}).toArray() as any[])
        return 0
    },
    async getSessionsByUserId(userId : ObjectId){
        const activeSession = await refreshTokenCollection.find({userId: userId}).toArray() as any//Array<refreshTokenDb>
        //const validActiveSession = activeSession.filter((session: { issuedAt: { getSeconds: () => any; }; }) => (session.issuedAt.getSeconds()) < (new Date().getSeconds()))
        return activeSession;
    },
    async getSessionsByDeviceId(deviceId: ObjectId){
        const session = await refreshTokenCollection.findOne({deviceId: deviceId})
        return session
    },
    async deleteAllOther(userId: ObjectId, deviceId: ObjectId){
        await refreshTokenCollection.deleteMany({validUntil:{$lt: new Date()}, userId: new ObjectId(userId), deviceId:{$ne: deviceId}})
        return 0
    },
    async deleteSessionByDeviceId(deviceId: ObjectId){
        const deleted = await refreshTokenCollection.deleteOne({deviceId: deviceId})
        return deleted
    }
}