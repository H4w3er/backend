import {refreshTokenCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";

const sessionsMapper = async (value: Array<any>) => {
    //const activeSessions = value.filter(session => session.validUntil >=  new Date())
    const mappedSessions = value.map(session =>
        session = {
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
    })
    return mappedSessions
}

export const securityDevicesDbRepository={
    async getActiveSessions(userId: ObjectId) {
        const sessions = await refreshTokenCollection.find({userId: new ObjectId(userId)}).toArray() as any[];
        return sessionsMapper(sessions)
    },
    async addNewSession(ip:string|undefined|string[], title: string|undefined, lastActiveDate: string, deviceId: ObjectId, issuedAt: Date, validUntil: Date, userId:ObjectId, refreshToken: string){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken})
        return 0
    },
    async getSessionsByUserId(userId : ObjectId){
        const activeSession = await refreshTokenCollection.find({userId: userId}).toArray() as any//Array<refreshTokenDb>
        return activeSession;
    },
    async getSessionsByDeviceId(deviceId: ObjectId){
        const session = await refreshTokenCollection.findOne({deviceId: deviceId})
        return session
    },
    async deleteAllOther(userId: ObjectId, deviceId: ObjectId){
        await refreshTokenCollection.deleteMany({userId: new ObjectId(userId), deviceId:{$ne: new ObjectId(deviceId)}})
        return 0
    },
    async deleteSessionByDeviceId(deviceId: ObjectId){
        const deleted = await refreshTokenCollection.deleteOne({deviceId: deviceId})
        return deleted
    },
    async sessionUpdate(userId: ObjectId, deviceId: ObjectId, refreshToken: string){
        const date = new Date().toISOString()
        await refreshTokenCollection.updateOne({userId: new ObjectId(userId), deviceId: new ObjectId(deviceId)}, {$set: {lastActiveDate: date, refreshToken: refreshToken}})
        return 0
    }
}