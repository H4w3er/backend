import {injectable} from "inversify";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async getCommentById(req: Request, res: Response) {
        const userId = req.user!._id
        const comment = await this.commentsService.getCommentById(req.params.id, userId)
        if (!comment) {
            res.sendStatus(404)
        } else res.status(200).send(comment)
    }

    async updateComment(req: Request, res: Response) {
        const newComment = await this.commentsService.updateCommentById(req.params.commentId, req.body.content, req.user!._id as string)
        if (!newComment) res.sendStatus(404)
        else if (newComment === 1) res.sendStatus(403)
        else res.sendStatus(204)
    }

    async deleteComment(req: Request, res: Response) {
        const newComment = await this.commentsService.deleteCommentById(req.params.id, req.user!._id)
        if (!newComment) res.sendStatus(404)
        else if (newComment === 1) res.sendStatus(403)
        else res.sendStatus(204)
    }

    async updateLikeStatus(req: Request, res: Response){
        const likeStatus = req.body.likeStatus
        const userId = req.user!._id
        const commentId = req.params.commentId
        const response = await this.commentsService.updateLikeStatus(likeStatus, userId, commentId)
        if (response === "not found") res.sendStatus(404)
        else res.sendStatus(204)
    }
}