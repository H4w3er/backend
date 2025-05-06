import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export class RefreshTokenDb {
    constructor(
        public ip: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public issuedAt: Date,
        public validUntil: Date,
        public userId: ObjectId,
        public refreshToken: string
    ) {

    }
}

export const RefreshTokenDbSchema = new mongoose.Schema<RefreshTokenDb>({
    ip: {type: String, require: true},
    title: {type: String, require: true},
    lastActiveDate: {type: String, require: true},
    deviceId: {type: String, require: true},
    issuedAt: {type: Date, require: true},
    validUntil: {type: Date, require: true},
    userId: {type: ObjectId, require: true},
    refreshToken: {type: String, require: true}
})
export const RefreshTokenDbModel = mongoose.model<RefreshTokenDb>('refreshTokens', RefreshTokenDbSchema)