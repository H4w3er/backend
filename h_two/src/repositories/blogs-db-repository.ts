import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDbType} from "../db/blogs-type-db";
import {ObjectId} from "mongodb";
import {postsRepository} from "./posts-db-repository";

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

const blogFilter = async (searchNameTerm: string, sortBy: string, sortDirection: any = 'desc', pageNumber:number=1, pageSize:number=10) => {
// формирование фильтра (может быть вынесено во вспомогательный метод)
    const byName = searchNameTerm
        ? {name: {$regex: searchNameTerm, $options: "i"}}
        : {}

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
            page: Number(pageNumber),
            pageSize: Number(pageSize),
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
        return blogFilter(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
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