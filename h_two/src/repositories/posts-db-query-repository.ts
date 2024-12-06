import {postCollection} from "../db/mongo-db";
import {PostDbType} from "../db/posts-type-db";
import {ObjectId} from "mongodb";

const postMapper = (value: any) => {
    if (value) {
        return {
            id: value._id,
            title: value.title,
            shortDescription: value.shortDescription,
            content: value.content,
            blogId: value.blogId,
            blogName: value.blogName,
            createdAt: value.createdAt
        };
    } else return null;
}
const postFilterForBlog = async (blogId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber:number=1, pageSize:number=10) => {
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
const postFilter = async (sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber:number=1, pageSize:number=10) => {
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

export const postQueryRepository = {
    async findPosts(sortBy: any, sortDirection: any, pageNumber: number, pageSize: number){
        return postFilter(sortBy, sortDirection, pageNumber, pageSize)
    },
    async findPostById(id: string): Promise<PostDbType | null>{
        const objId = new ObjectId(id);
        const post = await postCollection.findOne({_id: objId})
        return postMapper(post)
    },
    async postsForBlog(blogId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number){
        return postFilterForBlog(blogId, sortBy, sortDirection, pageNumber, pageSize)
    },
    async findPostByIdForComments(id: string): Promise<number | null>{
        const objId = new ObjectId(id);
        const post = await postCollection.countDocuments({_id: objId})
        return post
    },
}