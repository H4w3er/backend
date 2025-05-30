import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {UserModel, UserViewType} from "../db/user-type-db";
import {injectable} from "inversify";

@injectable()
export class UsersDbRepository {
    async createUser(newUser: any) {
        await UserModel.insertOne(newUser)
        return await this.userMapper(newUser);
    }

    async deleteUser(id: string) {
        const objId = new ObjectId(id);
        const result = await UserModel.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await UserModel.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
        return user
    }

    async findUserById(id: string) {
        const newId = new ObjectId(id)
        const user = await UserModel.findOne({_id: newId})
        return user
    }

    async findUserByCode(code: string) {
        const user = await UserModel.findOne({'emailConfirm.confCode': code})
        return user
    }

    async updateUserByCode(code: string) {
        await UserModel.updateOne({'emailConfirm.confCode': code}, {$set: {'emailConfirm.isConfirmed': true}})
    }

    async updateUserPasswordByCode(recoveryCode: string, passwordHash: string, passwordSalt: string) {
        await UserModel.updateOne({'emailConfirm.confCode': recoveryCode}, {$set: {passwordHash: passwordHash, passwordSalt: passwordSalt}})
    }

    async updateUserCodeByCode(code: string) {
        const newCode = uuidv4()
        await UserModel.updateOne({'emailConfirm.confCode': code}, {$set: {'emailConfirm.confCode': newCode}})
        return newCode
    }

    async addToBlackList(refreshToken: string, userId: string | ObjectId) {
        await UserModel.updateOne({_id: new ObjectId(userId)}, {$push: {refreshTokenBlackList: refreshToken}})
        return true
    }

    async userMapper(value: any): Promise<UserViewType> {
        const user = new UserViewType(
            value._id,
            value.userName,
            value.email,
            value.createdAt
        )
        return user
    }
}