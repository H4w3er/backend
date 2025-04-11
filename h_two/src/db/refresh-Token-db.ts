import {ObjectId} from "mongodb";

export type refreshTokenDb = {
    ip: string
    title: string | 'noTitle'
    lastActiveDate: string
    deviceId: string
    issuedAt: Date
    validUntil: Date
    userId: ObjectId
    refreshToken: string
}