import {blogCollection, postCollection} from "../db/mongo-db";
import {PostDbType} from "../db/posts-type-db";
import {ObjectId} from "mongodb";

const postMapper = (value: any) => {
    if (value) {
        const mappedPost = {
            id: value._id,
            title: value.title,
            shortDescription: value.shortDescription,
            content: value.content,
            blogId: value.blogId,
            blogName: value.blogName,
            createdAt: value.createdAt
        }
        return mappedPost;
    } else return null;
}

export const postsRepository = {
    async createPost(post: any){
        const newPostId = await postCollection.insertOne(post)
        return newPostId.insertedId;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.updateOne({_id: objId}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    },
    async deletePost(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
}