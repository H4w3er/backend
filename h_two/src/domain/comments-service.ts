import {CommentsDbRepository} from "../repositories/comments-db-repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(protected commentsDbRepository: CommentsDbRepository) {}

    async createComment(postId: string, content: string, userId: ObjectId, login: string){
        const newComment = {
            _id: new ObjectId(),
            content: content,
            commentatorInfo:{
                userId: userId,
                userLogin: login,
            },
            createdAt: new Date().toISOString(),
            postId: new ObjectId(postId),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
        },
        }
        return this.commentsDbRepository.createComment(newComment)
    }
    async getCommentById(commentId: string){
        return this.commentsDbRepository.getCommentById(commentId)
    }
    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber:any, pageSize:any){
        return await this.commentsDbRepository.getCommentForPost(postId, sortBy, sortDirection, pageNumber, pageSize)
    }
    async updateCommentById(commentId: string, newContent:string, userId: ObjectId){
        const oldComment = await this.commentsDbRepository.getCommentById(commentId)
        if (!oldComment) return null;
        if (userId !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.updateCommentById(commentId, newContent)
        return newComment;
    }
    async deleteCommentById(commentId: string, userId: ObjectId){
        const oldComment = await this.commentsDbRepository.getCommentById(commentId)
        if (!oldComment) return null;
        if (userId !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.deleteCommentById(commentId)
        return newComment;
    }
}