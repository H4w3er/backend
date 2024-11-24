import {blogCollection, postCollection, userCollection} from "../db/mongo-db";import {ObjectId} from "mongodb";


export const blogsRepository = {
    async createBlog(newBlog: any){
        const idOfNewBlog = await blogCollection.insertOne(newBlog)
        return idOfNewBlog.insertedId;
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
        await userCollection.deleteMany()
        return true;
    },
    async isBlog(blogId: string): Promise<boolean>{
        const id = new ObjectId(blogId)
        const result = await blogCollection.countDocuments({_id: id})
        return result === 1;
    }
}