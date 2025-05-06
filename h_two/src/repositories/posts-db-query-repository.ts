import {PostDbType, PostDbTypeModel} from "../db/posts-type-db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsDbQueryRepository {
    postMapper(value: PostDbType | null) {
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

    async postFilterForBlog(blogId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: number = 1, pageSize: number = 10) {
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await PostDbTypeModel
                .find({blogId: blogId})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await PostDbTypeModel.countDocuments({blogId: blogId})

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: items.map(value => this.postMapper(value))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }

    async postFilter(sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: any = 1, pageSize: any = 10) {
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await PostDbTypeModel
                .find({})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await PostDbTypeModel.countDocuments()

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: items.map(value => this.postMapper(value))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }

    async findPosts(sortBy: any, sortDirection: any, pageNumber: string, pageSize: string) {
        return this.postFilter(sortBy, sortDirection, pageNumber, pageSize)
    }

    async findPostById(id: string) {
        const objId = new ObjectId(id);
        const post: PostDbType | null = await PostDbTypeModel.findOne({_id: objId})
        return this.postMapper(post)
    }

    async postsForBlog(blogId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number) {
        return this.postFilterForBlog(blogId, sortBy, sortDirection, pageNumber, pageSize)
    }
}