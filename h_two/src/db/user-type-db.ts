import mongoose from 'mongoose'
import {ObjectId} from "mongodb";

export class UserDbTypeCommon {
    constructor(public _id: ObjectId,
        public userName: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string,
        public emailConfirm: {
             confCode: string,
             isConfirmed: boolean
        },
        public refreshTokenBlackList: Array<string>

    )
    {}
}

export class UserViewType {
    constructor(public id: ObjectId,
                public login: string,
                public email: string,
                public createdAt: string
    ) {
    }
}

export const UserSchema = new mongoose.Schema<UserDbTypeCommon>({
    _id: { type: ObjectId, require: true },
    userName: { type: String, require: true },
    email: { type: String, require: true },
    passwordHash: { type: String, require: true },
    passwordSalt: { type: String, require: true },
    createdAt: { type: String, require: true },
    emailConfirm: {
        confCode: String,
        isConfirmed: Boolean},
    refreshTokenBlackList: []
})
export const UserModel = mongoose.model<UserDbTypeCommon>('users', UserSchema)