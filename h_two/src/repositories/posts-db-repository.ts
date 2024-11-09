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

const postFilter = async (sortBy: string, sortDirection: any, pageNumber:number=1, pageSize:number=10) => {
    try {
        // собственно запрос в бд (может быть вынесено во вспомогательный метод)
        const items = await postCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(Number(pageSize))
            .toArray() as any[]
        const totalCount = await postCollection.countDocuments()

        // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: totalCount,
            items: items.map(value => postMapper(value))
        }
    } catch (e) {
        console.log(e)
        return {error: 'some error'}
    }
}
const postFilterForBlog = async (blogId: string, sortBy: any, sortDirection: any, pageNumber:number=1, pageSize:number=10) => {
    try {
        // собственно запрос в бд (может быть вынесено во вспомогательный метод)
        const items = await postCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(Number(pageSize))
            .toArray() as any[]
        const totalCount = await postCollection.countDocuments({blogId: blogId})

        // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: totalCount,
            items: items.map(value => postMapper(value))
        }
    } catch (e) {
        console.log(e)
        return {error: 'some error'}
    }
}

export const postsRepository = {
    async findPosts(sortBy: any, sortDirection: any, pageNumber: number, pageSize: number){
        return postFilter(sortBy, sortDirection, pageNumber, pageSize)
    },
    async findPostById(id: string): Promise<PostDbType | null>{
        const objId = new ObjectId(id);
        const post = await postCollection.findOne({_id: objId})
        return postMapper(post)
    },
    // @ts-ignore
    async createPost(title: string, shortDescription: string, content: string, blogId: string){
        const objBlogId = new ObjectId(blogId)
        const blog = await blogCollection.findOne({_id: objBlogId})
        if (blog?.name !== undefined){
            const newPost = {
            //id: (+(Date.now())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog?.name.toString(),
            createdAt: new Date().toISOString()
        }
            const newPostId = await postCollection.insertOne(newPost)
            const newPostWithId = await postCollection.findOne({_id: newPostId.insertedId})
            return postMapper(newPostWithId);
        }
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
    },
    async findPostByBlogId(blogId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number){
        return postFilterForBlog(blogId, sortBy, sortDirection, pageNumber, pageSize)
    },
}