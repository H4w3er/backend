import {SETTINGS} from "../settings";
import {BlogDbType} from "./blogs-type-db";
import {PostDbType} from "./posts-type-db";
import {UserDbTypeCommon} from "./user-type-db";
import {RefreshTokenDb} from "./refresh-Token-db";
import {requestsToApi} from "./requests-to-api-type-db";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {CommentsDbTypeCommon} from "./comments-type-db";

dotenv.config()

const dbName = 'Data'
const mongoURI = SETTINGS.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`

export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        console.log('db connected')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}

// получение доступа к бд
// const client: MongoClient = new MongoClient(SETTINGS.MONGO_URI)
// export const db: Db = client.db(SETTINGS.DB_NAME);
//
// // получение доступа к коллекциям
// export const blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>(SETTINGS.PATH.BLOGS)
// export const postCollection: Collection<PostDbType> = db.collection<PostDbType>(SETTINGS.PATH.POSTS)
// export const userCollection: Collection<UserDbTypeCommon> = db.collection<UserDbTypeCommon>(SETTINGS.PATH.USERS)
// export const commentsCollection: Collection<CommentsDbTypeCommon> = db.collection<CommentsDbTypeCommon>(SETTINGS.PATH.COMMENTS)
// export const refreshTokenCollection: Collection<refreshTokenDb> = db.collection<refreshTokenDb>(SETTINGS.PATH.SECURITYDEVICES)
// export const requestsToApiCollection: Collection<requestsToApi> = db.collection<requestsToApi>(SETTINGS.PATH.REQUESTSTOAPI)

/*export async function runDb () {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}*/
