import {CommentsDbRepository} from "../repositories/comments-db-repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {JwtService} from "../application/jwt-service";

@injectable()
export class CommentsService {
    constructor(protected commentsDbRepository: CommentsDbRepository, protected jwtService: JwtService) {}

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
    async getCommentById(commentId: string, authToken: string){
        let user = null
        if (authToken) {
            user = await this.jwtService.getIdFromToken(authToken.split(' ')[1] as string)
        }
        if (!user) return this.commentsDbRepository.getCommentById(commentId, 'nothing')
        else return this.commentsDbRepository.getCommentById(commentId, user.userId.toString())
    }
    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber:any, pageSize:any, authToken: string){
        let user = null
        if (authToken) {
            user = await this.jwtService.getIdFromToken(authToken.split(' ')[1] as string)
        }
        if (!user) return await this.commentsDbRepository.getCommentForPost(postId, sortBy, sortDirection, pageNumber, pageSize, 'nothing')
        else return await this.commentsDbRepository.getCommentForPost(postId, sortBy, sortDirection, pageNumber, pageSize, user.userId.toString())
    }
    async updateCommentById(commentId: string, newContent:string, userId: string){
        const userIdObj = new ObjectId(userId)
        const oldComment = await this.commentsDbRepository.getCommentById(commentId, userId)
        if (!oldComment) return null;
        if (userIdObj !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.updateCommentById(commentId, newContent)
        return newComment;
    }
    async deleteCommentById(commentId: string, userId: string){
        const userIdObj = new ObjectId(userId)
        const oldComment = await this.commentsDbRepository.getCommentById(commentId, userId)
        if (!oldComment) return null;
        if (userIdObj !== oldComment.commentatorInfo.userId) return 1;
        const newComment = await this.commentsDbRepository.deleteCommentById(commentId)
        return newComment;
    }
    async updateLikeStatus(newLikeStatus: string, userId: ObjectId, commentId: string){
        const comment = await this.commentsDbRepository.getCommentById(commentId, userId.toString())
        if (!comment) return 'not found'
        const oldStatus = await this.commentsDbRepository.getLikeStatus(userId.toString(), commentId)
        if (!oldStatus) return 'not found'
        if (oldStatus.status === newLikeStatus) return 'updated'
        await this.commentsDbRepository.updateLikeStatus(newLikeStatus, userId.toString(), commentId, oldStatus.status)
        return 'updated'
    }
}