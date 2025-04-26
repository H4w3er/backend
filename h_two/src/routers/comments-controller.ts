import {injectable} from "inversify";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
        } else res.status(200).send(comment)
    }

    async updateComment(req: Request, res: Response) {
        const newComment = await this.commentsService.updateCommentById(req.params.commentId, req.body.content, req.user!._id)
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
}