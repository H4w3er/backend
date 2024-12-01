import {SETTINGS} from "../settings";
import {Collection, Db, MongoClient} from "mongodb";
import {BlogDbType} from "./blogs-type-db";
import {PostDbType} from "./posts-type-db";
import {UserDbType} from "./user-type-db";
import {CommentsDbType} from "./comments-type-db";

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URI)
export const db: Db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>(SETTINGS.PATH.BLOGS)
export const postCollection: Collection<PostDbType> = db.collection<PostDbType>(SETTINGS.PATH.POSTS)
export const userCollection: Collection<UserDbType> = db.collection<UserDbType>(SETTINGS.PATH.USERS)
export const commentsCollection: Collection<CommentsDbType> = db.collection<CommentsDbType>(SETTINGS.PATH.COMMENTS)

export async function runDb () {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}
