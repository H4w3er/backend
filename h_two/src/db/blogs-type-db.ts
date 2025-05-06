import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class BlogDbType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean) {

    }
}

export const BlogDbTypeSchema = new mongoose.Schema<BlogDbType>({
    _id: {type: ObjectId, require: true},
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: String, require: true},
    isMembership: {type: Boolean, require: true},
})
export const BlogDbTypeModel = mongoose.model<BlogDbType>('blogs', BlogDbTypeSchema)