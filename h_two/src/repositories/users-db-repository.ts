import {userCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(newUser: any){
        const newUserId = await userCollection.insertOne(newUser)
        const newUserInDb = await userCollection.findOne({_id: newUserId.insertedId})
        return userMapper(newUserInDb);
    },
    async deleteUser(id: string){
        const objId = new ObjectId(id);
        const result = await userCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
}

const userMapper = (value: any)=> {
    return {
        id: value._id,
        login: value.login,
        email: value.email,
        createdAt: value.createdAt,
    }
}