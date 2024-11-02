import {blogCollection, postCollection} from "../db/mongo-db";
import {PostDbType} from "../db/posts-type-db";

export const postsRepository = {
    async findPosts(): Promise<PostDbType[]>{
        return postCollection.find({}).toArray()
    },
    async findPostById(id: string): Promise<PostDbType | null>{
        return await postCollection.findOne({id: id})
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostDbType>{
        const newPost = {
            id: (+(Date.now())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            // @ts-ignore
            blogName: blogCollection.find({id: blogId}).name,
            // @ts-ignore
            createdAt: new Date().toISOString()
        }
        await postCollection.insertOne(newPost)
        return newPost;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const result = await postCollection.updateOne({id: id}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    },
    async deletePost(id: string): Promise<boolean>{
        const result = await postCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    },
    async isBlog(blogId: string): Promise<boolean>{
        const result = blogCollection.find({id: blogId})
        return  result.bufferedCount() === 1;
    }
}