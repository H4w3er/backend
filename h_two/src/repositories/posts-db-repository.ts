import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {PostDbTypeModel} from "../db/posts-type-db";

@injectable()
export class PostsDbRepository {
    async createPost(post: any){
        await post.save()
        return post._id;
    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await PostDbTypeModel.updateOne({_id: objId}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    }
    async deletePost(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await PostDbTypeModel.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
}