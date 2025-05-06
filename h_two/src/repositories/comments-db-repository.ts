import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentsDbTypeCommon, CommentsModel, LikerInfo, LikerInfoModel} from "../db/comments-type-db";

@injectable()
export class CommentsDbRepository {

    commentMapper(comment: CommentsDbTypeCommon | null, status: string = 'None') {
        if (comment && status) {
            return {
                id: comment._id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: status
                },
            }
        }
        return null;
    }

    async commentFilterForPost(postId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber: number = 1, pageSize: number = 10) {
        try {
            const items = await CommentsModel
                .find({postId: new ObjectId(postId)})
                .sort({[sortBy]: sortDirection})
                .skip((pageNumber - 1) * pageSize)
                .limit(Number(pageSize))
                .lean()
            const totalCount = await CommentsModel.countDocuments({postId: new ObjectId(postId)})

            // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount: totalCount,
                items: items.map(value => this.commentMapper(value))
            }
        } catch (e) {
            console.log(e)
            return {error: 'some error'}
        }
    }

    async createComment(comment: CommentsDbTypeCommon) {
        await CommentsModel.insertOne(comment);
        return this.commentMapper(comment)
    }

    async getCommentById(commentId: string, userId: string) {
        const commentIdObj = new ObjectId(commentId)
        const comment = await CommentsModel.findOne({_id: commentIdObj})
        let likeInfo: LikerInfo | null = await LikerInfoModel.findOne({likerId: userId, commentId: commentId})

        if (!likeInfo) {
            likeInfo = {likerId: userId, status: 'None', commentId: commentId}
            await LikerInfoModel.insertOne(likeInfo)
            return this.commentMapper(comment, likeInfo.status)
        } else return this.commentMapper(comment, likeInfo.status)

    }

    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber: number, pageSize: number) {
        return this.commentFilterForPost(postId, sortBy, sortDirection, pageNumber, pageSize)
    }

    async updateCommentById(commentId: string, newContent: string) {
        await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: {content: newContent}})
        return true
    }

    async deleteCommentById(commentId: string) {
        await CommentsModel.deleteOne({_id: new ObjectId(commentId)})
        return true
    }

    async updateLikeStatus(newLikeStatus: string, userId: string, commentId: string){
        await LikerInfoModel.updateOne({likerId: userId, commentId: commentId}, {$set: {status: newLikeStatus}})

    }
}