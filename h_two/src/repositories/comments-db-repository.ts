import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentsDbTypeCommon, PostDbTypeModel, LikerInfo, LikerInfoModel} from "../db/comments-type-db";

@injectable()
export class CommentsDbRepository {

    commentMapper(comment: CommentsDbTypeCommon | null, status: string = 'None') {
        if (comment) {
            return {
                id: comment._id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount,
                    myStatus: status
                },
            }
        }
        return null;
    }

    async commentFilterForPost(postId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: number = 1, pageSize: number = 10, userId: string = 'nothing') {
        try {
            const items = await PostDbTypeModel
                .find({postId: new ObjectId(postId)})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await PostDbTypeModel.countDocuments({postId: new ObjectId(postId)})
            const likesInfoArray = await LikerInfoModel.find({
                likerId: userId,
            }).lean()

            const mappedItems = items.map(comment => {
                if (userId === 'nothing') return this.commentMapper(comment)
                else {
                    for (let likerInfo of likesInfoArray) {
                        if (comment._id.toString() === likerInfo.commentId) return this.commentMapper(comment, likerInfo.status)
                    }
                    return this.commentMapper(comment)
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

    async createComment(comment: CommentsDbTypeCommon) {
        await PostDbTypeModel.create(comment);
        await LikerInfoModel.create({likerId: comment.commentatorInfo.userId.toString(), status: 'None', commentId: comment._id.toString()})
        return this.commentMapper(comment)
    }

    async getCommentById(commentId: string, userId: string) {
        const commentIdObj = new ObjectId(commentId)
        const comment = await PostDbTypeModel.findOne({_id: commentIdObj})
        if (userId === 'nothing') return this.commentMapper(comment)
        let likeInfo: LikerInfo | null = await LikerInfoModel.findOne({likerId: userId, commentId: commentId})
        if (!likeInfo) {
            likeInfo = {likerId: userId, status: 'None', commentId: commentId}
            await LikerInfoModel.create(likeInfo)
            return this.commentMapper(comment, likeInfo.status)
        } else return this.commentMapper(comment, likeInfo.status)

    }

    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number, userId: string) {
        return this.commentFilterForPost(postId, sortBy, sortDirection, pageNumber, pageSize, userId)
    }

    async updateCommentById(commentId: string, newContent: string) {
        await PostDbTypeModel.updateOne({_id: new ObjectId(commentId)}, {$set: {content: newContent}})
        return true
    }

    async deleteCommentById(commentId: string) {
        await PostDbTypeModel.deleteOne({_id: new ObjectId(commentId)})
        return true
    }

    async updateLikeStatus(newLikeStatus: string, userId: string, commentId: string, oldLikeStatus: string){
        const commentIdObj = new ObjectId(commentId)
        //console.log(newLikeStatus + '   ' + oldLikeStatus)
        await LikerInfoModel.updateOne({likerId: userId, commentId: commentId}, {$set: {status: newLikeStatus}})
        if (newLikeStatus === 'None' && oldLikeStatus === 'Like') await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: { "likesInfo.likesCount": -1}})
        if (newLikeStatus === 'None' && oldLikeStatus === 'Dislike') await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: { "likesInfo.dislikesCount": -1}})
        if (newLikeStatus === 'Like' && oldLikeStatus === 'Dislike') {
            await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: { "likesInfo.likesCount": 1}})
            await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: {"likesInfo.dislikesCount": -1}})
        }
        if (newLikeStatus === 'Like' && oldLikeStatus === 'None') await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: { "likesInfo.likesCount": 1}})
        if (newLikeStatus === 'Dislike' && oldLikeStatus === 'None') await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: { "likesInfo.dislikesCount": 1}})
        if (newLikeStatus === 'Dislike' && oldLikeStatus === 'Like'){
            await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: {"likesInfo.likesCount": -1}})
            await PostDbTypeModel.updateOne({_id: commentIdObj}, {$inc: {"likesInfo.dislikesCount": +1}})
        }
    }

    async getLikeStatus(userId: string, commentId: string){
        return LikerInfoModel.findOne({likerId: userId, commentId: commentId})
    }
}