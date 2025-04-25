import {Router, Request, Response} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {CommentsService} from "../domain/comments-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentCommentValidation} from "../middlewares/comments-validation";

export const commentsRouter = Router()

class CommentsController {
    commentsService: CommentsService
    constructor() {
        this.commentsService = new CommentsService()
    }
    async getCommentById(req: Request, res: Response){
        const comment = await this.commentsService.getCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
        } else res.status(200).send(comment)
    }
    async updateComment(req: Request, res: Response){
        const newComment = await this.commentsService.updateCommentById(req.params.commentId, req.body.content, req.user!._id)
        if (!newComment) res.sendStatus(404)
        else if (newComment === 1) res.sendStatus(403)
        else res.sendStatus(204)
    }
    async deleteComment(req: Request, res: Response){
        const newComment = await this.commentsService.deleteCommentById(req.params.id, req.user!._id)
        if (!newComment) res.sendStatus(404)
        else if (newComment === 1) res.sendStatus(403)
        else res.sendStatus(204)
    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))

commentsRouter.put('/:commentId', authBearerMiddleware, contentCommentValidation, inputValidationMiddleware, commentsController.updateComment.bind(commentsController))

commentsRouter.delete('/:id', authBearerMiddleware, commentsController.deleteComment.bind(commentsController))

