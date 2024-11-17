import {blogCollection, postCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {postsRepository} from "./posts-db-repository";


export const blogsRepository = {
    async createBlog(newBlog: any){
        const idOfNewBlog = await blogCollection.insertOne(newBlog)
        return idOfNewBlog.insertedId; //нужно чтобы возвращался только id
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await blogCollection.updateOne({_id: objId}, {$set:{name: name, description: description, websiteUrl: websiteUrl}})
        return result.matchedCount === 1;
    },
    async deleteBlog(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await blogCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    },
    async deleteAll(): Promise<boolean>{
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        return true;
    },
    async isBlog(blogId: string): Promise<boolean>{
        const id = new ObjectId(blogId)
        const result = await blogCollection.countDocuments({_id: id})
        return result === 1;
    },
    async postsForBlog(blogId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number) {
        if(await this.isBlog(blogId)) {
            return postsRepository.findPostByBlogId(blogId, sortBy, sortDirection, pageNumber, pageSize)
        } else return null
    },
    async createPostForBlog(id: string, title: string, shortDescription: string, content: string){
        if(await this.isBlog(id)) {
            return postsRepository.createPost(title, shortDescription, content, id)
        } else return null
    }
}