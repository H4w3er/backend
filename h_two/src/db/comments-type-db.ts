import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export class CommentsDbTypeCommon {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: ObjectId,
            userLogin: string
        },
        public createdAt: string,
        public postId: ObjectId,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }
    ) {
    }
}

export class LikerInfo {
    constructor(
        public likerId: string,
        public status: string,
        public commentId: string
    ) {
    }
}

export const CommentsSchema = new mongoose.Schema<CommentsDbTypeCommon>({
    _id: {type: ObjectId, require: true},
    content: {type: String, require: true},
    commentatorInfo: {
        userId: ObjectId,
        userLogin: String
    },
    createdAt: {type: String, require: true},
    postId: {type: ObjectId, require: true},
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: ['None', 'Like', 'Dislike']
    }
})
export const LikerInfoSchema = new mongoose.Schema<LikerInfo>({
     likerId: {type: String, require: true},
     status: {type: String, require: true},
     commentId: {type: String, require: true}
})
export const PostDbTypeModel = mongoose.model<CommentsDbTypeCommon>('comments', CommentsSchema)
export const LikerInfoModel = mongoose.model<LikerInfo>('likes', LikerInfoSchema)