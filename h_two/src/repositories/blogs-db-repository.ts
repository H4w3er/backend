import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDbType} from "../db/blogs-type-db";
import {ObjectId} from "mongodb";

const blogMapper = (value: any) => {
    if (value) {
    const mappedBlog = {
        id: value._id,
        name: value.name,
        description: value.description,
        websiteUrl: value.websiteUrl,
        createdAt: value.createdAt,
        isMembership: value.isMembership
    }
    return mappedBlog;
    } else return null;
}

export const blogsRepository = {
    async findBlogs(){
        let arrayOfBlogs = await blogCollection.find({}).toArray()
        return arrayOfBlogs.map(value => blogMapper(value))
    },
    async findBlogsById(id: string): Promise<BlogDbType | null>{
        const newId = new ObjectId(id);
        const blog = await blogCollection.findOne({_id: newId})
        return blogMapper(blog)
    },
    async createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            //id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const idOfNewBlog = await blogCollection.insertOne(newBlog)
        const blog = await blogCollection.findOne({_id: idOfNewBlog.insertedId})
        return blogMapper(blog);
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
    }
}