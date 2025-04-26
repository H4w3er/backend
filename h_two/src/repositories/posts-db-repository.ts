import {postCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsDbRepository {
    async createPost(post: any){
        const newPostId = await postCollection.insertOne(post)
        return newPostId.insertedId;
    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.updateOne({_id: objId}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    }
    async deletePost(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
}