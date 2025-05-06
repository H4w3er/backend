import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {UserModel} from "../db/user-type-db";
import {BlogDbTypeModel} from "../db/blogs-type-db";
import {PostDbTypeModel} from "../db/posts-type-db";
import {CommentsModel, LikerInfoModel} from "../db/comments-type-db";
import {RefreshTokenDbModel} from "../db/refresh-Token-db";
import {RequestsToApiModel} from "../db/requests-to-api-type-db";

@injectable()
export class BlogsDbRepository {
    async createBlog(newBlog: any) {
        await BlogDbTypeModel.insertOne(newBlog)
        return newBlog._id;
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const objId = new ObjectId(id);
        const result = await BlogDbTypeModel.updateOne({_id: objId}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1;
    }

    async deleteBlog(id: string): Promise<boolean> {
        const objId = new ObjectId(id);
        const result = await BlogDbTypeModel.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }

    async deleteAll(): Promise<boolean> {
        await BlogDbTypeModel.deleteMany()
        await PostDbTypeModel.deleteMany()
        await UserModel.deleteMany()
        await CommentsModel.deleteMany()
        await RefreshTokenDbModel.deleteMany()
        await RequestsToApiModel.deleteMany()
        await LikerInfoModel.deleteMany()
        return true;
    }

    async isBlog(blogId: string): Promise<boolean> {
        const id = new ObjectId(blogId)
        const result = await BlogDbTypeModel.countDocuments({_id: id})
        return result === 1;
    }
}
