import {userCollection} from "../db/mongo-db";
import {injectable} from "inversify";


@injectable()
export class UsersDbQueryRepository {
    userMapper(value: any) {
        if (value) {
            return {
                id: value._id,
                login: value.userName,
                email: value.email,
                createdAt: value.createdAt
            };
        } else return null
    }
    async userFilter(sortBy: string = 'createdAt', sortDirection: any = 'desc', pageNumber: number = 1, pageSize: number = 10, searchLoginTerm: string, searchEmailTerm: string) {
        const byLogin = searchLoginTerm
            ? {userName: {$regex: searchLoginTerm, $options: "i"}}
            : {}
        const byEmail = searchEmailTerm
            ? {email: {$regex: searchEmailTerm, $options: "i"}}
            : {}
        const filter = {
            $or: [byLogin, byEmail]
        }
        if (sortBy === 'login') sortBy = 'userName'
        try {
            const items = await userCollection
                .find(filter)
                .sort(sortBy, sortDirection)
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .toArray() as any[]
            const totalCount = await userCollection.countDocuments(filter)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: items.map(value => this.userMapper(value))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }
    async getUsers(sortBy: string, sortDirection: string, pageNumber: string, pageSize: string, searchLoginTerm: string, searchEmailTerm: string) {
        const pageNumberNum: number = +pageNumber || 1
        const pageSizeNum: number = +pageSize || 10
        return this.userFilter(sortBy, sortDirection, pageNumberNum, pageSizeNum, searchLoginTerm, searchEmailTerm)
    }
}