import {userCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";

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
    }
}

const userMapper = (value: any)=> {
    return {
        id: value._id,
        login: value.userName,
        email: value.email,
        createdAt: value.createdAt,
    }
}