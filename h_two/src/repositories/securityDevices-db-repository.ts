import {refreshTokenCollection} from "../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {refreshTokenDb} from "../db/refresh-Token-db";
import {log} from "node:util";

const sessionsMapper = async (value: Array<any>) => {
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
    async addNewSession(ip:string, title: string, lastActiveDate: string, deviceId: string, issuedAt: Date, validUntil: Date, userId:ObjectId, refreshToken: string){
        await refreshTokenCollection.insertOne({ip, title, lastActiveDate, deviceId, issuedAt, validUntil, userId, refreshToken})
    },
    async getSessionsByUserId(userId : string){
        const activeSession = await refreshTokenCollection.find({userId: new ObjectId(userId)}).toArray() as any//Array<refreshTokenDb>
        return activeSession;
    },
    async getSessionsByDeviceId(deviceId: string){
        const session = await refreshTokenCollection.findOne({deviceId: deviceId})
        return session
    },
    async deleteAllOther(userId: string, deviceId: string){
        await refreshTokenCollection.deleteMany({$and: [{userId: new ObjectId(userId)}, {deviceId: {$ne : deviceId}}]})
    },
    async deleteSessionByDeviceId(deviceId: string){
        const deleted = await refreshTokenCollection.deleteOne({deviceId: deviceId})
        return deleted
    },
    async sessionUpdate(userId: ObjectId, deviceId: string, refreshToken: string){
        const date = new Date().toISOString()
        await refreshTokenCollection.updateOne({userId: new ObjectId(userId), deviceId: deviceId}, {$set: {lastActiveDate: date, refreshToken: refreshToken}})
    }
}
