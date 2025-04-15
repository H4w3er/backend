import {commentsRepository} from "../repositories/comments-db-repository";
import {ObjectId} from "mongodb";

export const commentsService = {
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
        return commentsRepository.createComment(newComment)
    },
    async getCommentById(commentId: string){
        return commentsRepository.getCommentById(commentId)
    },
    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber:any, pageSize:any){
        return await commentsRepository.getCommentForPost(postId, sortBy, sortDirection, pageNumber, pageSize)
    },
    async updateCommentById(commentId: string, newContent:string, userId: ObjectId){
        const oldComment = await commentsRepository.getCommentById(commentId)
        if (!oldComment) return null;
        if (userId.toString() !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await commentsRepository.updateCommentById(commentId, newContent)
        return newComment;
    },
    async deleteCommentById(commentId: string, userId: ObjectId){
        const oldComment = await commentsRepository.getCommentById(commentId)
        if (!oldComment) return null;
        if (userId.toString() !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await commentsRepository.deleteCommentById(commentId)
        return newComment;
    },
}