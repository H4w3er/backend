import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDbType} from "../db/blogs-type-db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async findBlogs(): Promise<BlogDbType[]>{
        return blogCollection.find({}).toArray()
    },
    async findBlogsById(id: string): Promise<BlogDbType | null>{
        return await blogCollection.findOne({id: id})
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogDbType>{
        const newBlog = {
            id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await blogCollection.insertOne(newBlog)
        return newBlog;
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        const result = await blogCollection.updateOne({id: id}, {$set:{name: name, description: description, websiteUrl: websiteUrl}})
        return result.matchedCount === 1;
    },
    async deleteBlog(id: string): Promise<boolean>{
        const result = await blogCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    },
    async deleteAll(): Promise<boolean>{
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        return true;
    },
    async isBlog(blogId: string): Promise<boolean>{
        //const id = new ObjectId(blogId)
        const result = await blogCollection.countDocuments({id: blogId})
        return result === 1;
    }
}