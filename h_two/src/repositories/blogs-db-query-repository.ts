import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";

class BlogsDbQueryRepository {
    async blogMapper  (value: any)  {
        if (value) {
            return {
                id: value._id,
                name: value.name,
                description: value.description,
                websiteUrl: value.websiteUrl,
                createdAt: value.createdAt,
                isMembership: value.isMembership
            };
        } else return null;
    }
    async blogFilter  (searchNameTerm: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber:number=1, pageSize:number=10)  {
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
                items: items.map(value => this.blogMapper(value))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }
    async findBlogs(id: string, searchNameTerm: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number) {
        return this.blogFilter(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
    }
    async findBlogsById(id: string) {
        const newId = new ObjectId(id);
        const blog = await blogCollection.findOne({_id: newId})
        return this.blogMapper(blog)
    }
    async getBlogName(id: string):Promise<string>{
        const newId = new ObjectId(id);
        const blog = await blogCollection.findOne({_id: newId})
        // @ts-ignore
        return blog.name;
    }
}

export const blogQueryRepository = new BlogsDbQueryRepository()