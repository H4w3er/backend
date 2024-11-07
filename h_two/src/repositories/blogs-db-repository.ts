import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDbType} from "../db/blogs-type-db";
import {ObjectId} from "mongodb";
import {query} from "express";

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

const blogFilter = async (blogId: string, searchNameTerm: string, sortBy: string, sortDirection: any, pageNumber: number, pageSize: number) => {
// формирование фильтра (может быть вынесено во вспомогательный метод)
    const byId = blogId
        ? {_id: new ObjectId(blogId)}
        : {}
    const byName = searchNameTerm
        ? {name: {$regex: searchNameTerm, $options: "i"}}
        : {}
    const filter = {
        ...byName
        //...byId
    }

    try {
        // собственно запрос в бд (может быть вынесено во вспомогательный метод)
        const items = await blogCollection
            .find(byName)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(Number(pageSize))
            .toArray() as any[]
        const totalCount = await blogCollection.countDocuments(byName)

        // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(value => blogMapper(value))
        }
    } catch (e) {
        console.log(e)
        return {error: 'some error'}
    }
}
export const blogsRepository = {
    async findBlogs(id: any, searchNameTerm:any, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number){
        return blogFilter(id, searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
    },
    async findBlogsById(id: string): Promise<BlogDbType | null>{
        const newId = new ObjectId(id);
        const blog = await blogCollection.findOne({_id: newId})
        return blogMapper(blog)
    },
    async createBlog(newBlog: any){
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