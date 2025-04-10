import {ObjectId} from "mongodb";

export type refreshTokenDb = {
    ip: string|undefined|string[]
    title: string|undefined
    lastActiveDate: string
    deviceId: string
    issuedAt: Date
    validUntil: Date
    userId: ObjectId
    refreshToken: string
}