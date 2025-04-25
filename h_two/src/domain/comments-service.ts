import {CommentsDbRepository} from "../repositories/comments-db-repository";
import {ObjectId} from "mongodb";

export class CommentsService {
    commentsDbRepository: CommentsDbRepository
    constructor() {
        this.commentsDbRepository = new CommentsDbRepository()
    }
    async createComment(postId: string, content: string, userId: ObjectId, login: string){
        const newComment = {
            content: content,
            commentatorInfo:{
                userId: userId.toString(),
                userLogin: login,
            },
            createdAt: new Date().toISOString(),
            postId: new ObjectId(postId)
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
        if (userId.toString() !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.updateCommentById(commentId, newContent)
        return newComment;
    }
    async deleteCommentById(commentId: string, userId: ObjectId){
        const oldComment = await this.commentsDbRepository.getCommentById(commentId)
        if (!oldComment) return null;
        if (userId.toString() !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.deleteCommentById(commentId)
        return newComment;
    }
}