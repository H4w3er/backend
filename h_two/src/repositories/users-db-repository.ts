import {userCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";

export const usersRepository = {
    async createUser(newUser: any){
        await userCollection.insertOne(newUser)
        return userMapper(newUser);
    },
    async deleteUser(id: string){
        const objId = new ObjectId(id);
        const result = await userCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    },
    async findByLoginOrEmail(loginOrEmail: string){
        const user = await userCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
        return user
    },
    async findUserById(id: string){
        const newId = new ObjectId(id)
        const user = await userCollection.findOne({_id: newId})
        return user
    },
    async findUserByCode(code: string){
        const user = await userCollection.findOne({'emailConfirm.confCode': code})
        return user
    },
    async updateUserByCode(code: string){
        const user = await userCollection.updateOne({'emailConfirm.confCode': code}, {$set:{'emailConfirm.isConfirmed': true}})
        return true
    },
    async updateUserCodeByCode(code: string){
        const newCode = uuidv4()
        const user = await userCollection.updateOne({'emailConfirm.confCode': code}, {$set:{'emailConfirm.confCode': newCode}})
        return newCode
    }/*,
    async isTokenAllowed(refreshToken: string, userId: string){
        const user = await userCollection.findOne({_id: new ObjectId(userId)})

    }*/
}

const userMapper = (value: any)=> {
    return {
        id: value._id,
        login: value.userName,
        email: value.email,
        createdAt: value.createdAt,
    }
}