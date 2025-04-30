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
export const CommentsModel = mongoose.model<CommentsDbTypeCommon>('comments', CommentsSchema)