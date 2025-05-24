import {LastLikersModel, LikerPostInfo, LikerPostInfoModel, PostDbType, PostDbTypeModel} from "../db/posts-type-db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsDbQueryRepository {
    postMapper(value: PostDbType | null, status: string = 'None', info: any[] = []) {
        if (value) {
            return {
                id: value._id,
                title: value.title,
                shortDescription: value.shortDescription,
                content: value.content,
                blogId: value.blogId,
                blogName: value.blogName,
                createdAt: value.createdAt,
                extendedLikesInfo: {
                    likesCount: value.extendedLikesInfo.likesCount,
                    dislikesCount: value.extendedLikesInfo.dislikesCount,
                    myStatus: status,
                    newestLikes: info
                }
            };
        } else return null;
    }

    async postFilterForBlog(blogId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: number = 1, pageSize: number = 10, userId: string = 'nothing') {
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await PostDbTypeModel
                .find({blogId: blogId})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await PostDbTypeModel.countDocuments({blogId: blogId})
            const likesInfoArrayForBlog = await LikerPostInfoModel.find({
                likerId: userId,
            }).lean()

            const lastLikers = await LastLikersModel.find({}).sort({'newestLikes.addedAt': -1}).limit(3).lean()
            const newestLikes = lastLikers.flatMap(liker => {
                return liker.newestLikes?.map(pip => {
                    return {
                        addedAt: pip.addedAt,
                        userId: pip.userId,
                        login: pip.login
                    }
                })
            })

            const mappedItems = items.map(post => {
                if (userId === 'nothing') return this.postMapper(post, 'None', newestLikes)
                else {
                    for (let likerInfo of likesInfoArrayForBlog) {
                        if (post._id.toString() === likerInfo.postId) return this.postMapper(post, likerInfo.status, newestLikes)
                    }
                    return this.postMapper(post, 'None', newestLikes)
                }
            })

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: mappedItems
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }

    async postFilter(sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: any = 1, pageSize: any = 10, userId: string = 'nothing') {
        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await PostDbTypeModel
                .find({})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await PostDbTypeModel.countDocuments()
            const likesInfoArray = await LikerPostInfoModel.find({
                likerId: userId,
            }).lean()

            const lastLikers = await LastLikersModel.find({}).sort({'newestLikes.addedAt': -1}).limit(3).lean()
            /*const newestLikes: any[] = lastLikers.flatMap(liker => {
                return liker.newestLikes?.map(pip => {
                    return {
                        addedAt: pip.addedAt,
                        userId: pip.userId,
                        login: pip.login
                    }
                })
            })*/
            const newestLikes = lastLikers
                .flatMap(liker => liker.newestLikes || [])  // flatMap разворачивает верхний уровень
                .map(pip => ({  // затем маппим каждый элемент
                    addedAt: pip.addedAt,
                    userId: pip.userId,
                    login: pip.login
                }));
            //console.log(newestLikes)
            //console.log(newestLikes.flat())
            const mappedItems = items.map(post => {
                if (userId === 'nothing') return this.postMapper(post, 'None', newestLikes)
                else {
                    for (let likerInfo of likesInfoArray) {
                        if (post._id.toString() === likerInfo.postId) return this.postMapper(post, likerInfo.status, newestLikes)
                    }
                    return this.postMapper(post, 'None', newestLikes)
                }
            })

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: mappedItems
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }

    async findPosts(sortBy: any, sortDirection: any, pageNumber: string, pageSize: string, userId: string) {
        return this.postFilter(sortBy, sortDirection, pageNumber, pageSize, userId)
    }

    async findPostById(postId: string, userId: string) {
        const objId = new ObjectId(postId);
        const post: PostDbType | null = await PostDbTypeModel.findOne({_id: objId})
        const lastLikers = await LastLikersModel.find({}).sort({'newestLikes.addedAt': -1}).limit(3).lean()
        const newestLikes = lastLikers
            .flatMap(liker => liker.newestLikes || [])  // flatMap разворачивает верхний уровень
            .map(pip => ({  // затем маппим каждый элемент
                addedAt: pip.addedAt,
                userId: pip.userId,
                login: pip.login
            }));
        if (userId === 'nothing') return this.postMapper(post, 'None', newestLikes)
        let likeInfoPost: LikerPostInfo | null = await LikerPostInfoModel.findOne({likerId: userId, postId: postId})
        if (!likeInfoPost) {
            likeInfoPost = {likerId: userId, status: 'None', postId: postId}
            await LikerPostInfoModel.create(likeInfoPost)
            return this.postMapper(post, likeInfoPost.status, newestLikes)
        } else return this.postMapper(post, likeInfoPost.status, newestLikes)
    }

    async postsForBlog(blogId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number, userId: string) {
        return this.postFilterForBlog(blogId, sortBy, sortDirection, pageNumber, pageSize, userId)
    }

    async getLikeStatus(userId: string, postId: string) {
        return LikerPostInfoModel.findOne({likerId: userId, postId: postId})
    }
}