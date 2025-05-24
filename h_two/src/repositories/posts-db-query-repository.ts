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

    async postFilter(blogId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: any = 1, pageSize: any = 10, userId: string = 'nothing') {
        try {
            let items
            let totalCount
            if (blogId != 'nothing') {
                items = await PostDbTypeModel
                    .find({blogId: blogId})
                    .sort({[sortBy]: sortDirection})
                    .skip((pageNumber - 1) * pageSize)
                    .limit(Number(pageSize))
                    .lean()
                totalCount = await PostDbTypeModel.countDocuments({blogId: blogId})
            } else {
                items = await PostDbTypeModel
                    .find({})
                    .sort({[sortBy]: sortDirection})
                    .skip((pageNumber - 1) * pageSize)
                    .limit(Number(pageSize))
                    .lean()
                totalCount = await PostDbTypeModel.countDocuments({})
            }
            const likesInfoArray = await LikerPostInfoModel.find({
                likerId: userId,
            }).lean()

            const lastLikers = await LastLikersModel.find({}).sort({'newestLikes.addedAt': -1}).lean()
            const newestLikes = lastLikers
                .flatMap(liker => liker.newestLikes || [])
                .map(pip => ({
                    addedAt: pip.addedAt,
                    userId: pip.userId,
                    login: pip.login,
                    postId: pip.postId
                }));

            const mappedItems = items.map(post => {
                let pop = []
                let likeStatus = ''
                if (userId === 'nothing') {
                    for (let lastLikers of newestLikes) {
                        if (post._id.toString() === lastLikers.postId) pop.push({
                            addedAt: lastLikers.addedAt,
                            userId: lastLikers.userId,
                            login: lastLikers.login
                        })
                        if (pop.length === 3) break;
                    }
                    return this.postMapper(post, 'None', pop)
                } else {
                    for (let likerInfo of likesInfoArray) {
                        if (post._id.toString() === likerInfo.postId) likeStatus = likerInfo.status
                    }
                    if (likeStatus === '') likeStatus = 'None'
                    for (let lastLikers of newestLikes) {
                        if (post._id.toString() === lastLikers.postId) pop.push({
                            addedAt: lastLikers.addedAt,
                            userId: lastLikers.userId,
                            login: lastLikers.login
                        })
                        if (pop.length === 3) break;
                    }
                    return this.postMapper(post, likeStatus, pop)
                }
            })
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
        return this.postFilter('nothing', sortBy, sortDirection, pageNumber, pageSize, userId)
    }

    async findPostById(postId: string, userId: string) {
        const objId = new ObjectId(postId);
        const post: PostDbType | null = await PostDbTypeModel.findOne({_id: objId})
        const lastLikers = await LastLikersModel.find({'newestLikes.postId': postId}).sort({'newestLikes.addedAt': -1}).limit(3).lean()
        const newestLikes = lastLikers
            .flatMap(liker => liker.newestLikes || [])
            .map(pip => ({
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
        return this.postFilter(blogId, sortBy, sortDirection, pageNumber, pageSize, userId)
    }

    async getLikeStatus(userId: string, postId: string) {
        return LikerPostInfoModel.findOne({likerId: userId, postId: postId})
    }
}