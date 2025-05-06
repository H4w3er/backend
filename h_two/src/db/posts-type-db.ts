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
        public createdAt: string
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
})
export const PostDbTypeModel = mongoose.model<PostDbType>('posts', PostDbTypeSchema)