import {ObjectId} from "mongodb";


export type UserDbType = {
    "_id": ObjectId
    "userName": string,
    "email": string,
    "passwordHash": string,
    "passwordSalt": string,
    "createdAt": string
}
export type UserDbTypeCommon = {
    "_id": ObjectId,
    "userName": string,
    "email": string,
    "passwordHash": string,
    "passwordSalt": string,
    "createdAt": string
    "emailConfirm":{
        "confCode": string,
        "isConfirmed": boolean
    }
}