import {userCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {UserViewType} from "../db/user-type-db";

class UsersDbRepository{
    async createUser(newUser: any) {
        await userCollection.insertOne(newUser)
        return await this.userMapper(newUser);
    }
    async deleteUser(id: string){
        const objId = new ObjectId(id);
        const result = await userCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
    async findByLoginOrEmail(loginOrEmail: string){
        const user = await userCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
        return user
    }
    async findUserById(id: string){
        const newId = new ObjectId(id)
        const user = await userCollection.findOne({_id: newId})
        return user
    }
    async findUserByCode(code: string){
        const user = await userCollection.findOne({'emailConfirm.confCode': code})
        return user
    }
    async updateUserByCode(code: string){
        await userCollection.updateOne({'emailConfirm.confCode': code}, {$set:{'emailConfirm.isConfirmed': true}})
    }
    async updateUserCodeByCode(code: string){
        const newCode = uuidv4()
        await userCollection.updateOne({'emailConfirm.confCode': code}, {$set:{'emailConfirm.confCode': newCode}})
        return newCode
    }
    async addToBlackList(refreshToken: string, userId: string | ObjectId){
        await userCollection.updateOne({_id: new ObjectId(userId)}, {$push:{refreshTokenBlackList: refreshToken}})
        return true
    }
    async userMapper (value: any): Promise<UserViewType>  {
        return {
            id: value._id,
            login: value.userName,
            email: value.email,
            createdAt: value.createdAt,
        }
    }
}

export const usersRepository = new UsersDbRepository()

