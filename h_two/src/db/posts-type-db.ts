import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class PostDbType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }) {
    }
}

export class LikerPostInfo {
    constructor(
        public likerId: string,
        public status: string,
        public postId: string,
    ) {
    }
}

export class LastLikers {
    constructor(
        public newestLikes: [
            {
                addedAt: string,
                userId: string,
                login: string
                postId: string
            }
        ]
    ) {
    }
}

export const PostDbTypeSchema = new mongoose.Schema<PostDbType>({
    _id: {type: ObjectId, require: true},
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: String, require: true},
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: {type: String, enum: ['None', 'Like', 'Dislike']},

    }
})

export const LikerPostInfoSchema = new mongoose.Schema<LikerPostInfo>({
    likerId: {type: String, require: true},
    status: {type: String, require: true},
    postId: {type: String, require: true},
})

export const LastLikersSchema = new mongoose.Schema<LastLikers>({
    newestLikes: [
        {
            addedAt: {type: String, default: "-"},
            userId: {type: String, default: "-"},
            login: {type: String, default: "-"},
            postId: {type: String, default: "-"}
        }]
})


export const PostDbTypeModel = mongoose.model<PostDbType>('posts', PostDbTypeSchema)
export const LikerPostInfoModel = mongoose.model<LikerPostInfo>('likesToPost', LikerPostInfoSchema)
export const LastLikersModel = mongoose.model<LastLikers>('lastLikes', LastLikersSchema)