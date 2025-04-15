import {ObjectId} from "mongodb";


export type UserDbTypeCommon = {
    "_id": ObjectId,
    "userName": string,
    "email": string,
    "passwordHash": string,
    "passwordSalt": string,
    "createdAt": string,
    "emailConfirm":{
        "confCode": string,
        "isConfirmed": boolean
    }
    "refreshTokenBlackList": Array<string>
}
export type UserViewType = {
    id: ObjectId
    login: string
    email: string
    createdAt: string,
}