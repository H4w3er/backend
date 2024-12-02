import {Router} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {commentsService} from "../domain/comments-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentCommentValidation} from "../middlewares/comments-validation";

export const commentsRouter = Router()

commentsRouter.get('/:id',
    async (req, res) => {
        const comment = await commentsService.getCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
        } else res.status(200).send(comment)
})

commentsRouter.put('/:commentId',
    authBearerMiddleware,
    contentCommentValidation,
    inputValidationMiddleware,
    async (req,res) => {
        const newComment = await commentsService.updateCommentById(req.params.commentId, req.body.content, req.user!._id)
        if (!newComment) res.sendStatus(404)
        else if (newComment===1) res.sendStatus(403)
        else res.sendStatus(204)
})

commentsRouter.delete('/:id',
    authBearerMiddleware,
    async (req,res) => {
        const newComment = await commentsService.deleteCommentById(req.params.id, req.user!._id)
        if (!newComment) res.sendStatus(404)
        else if (newComment===1) res.sendStatus(403)
        else res.sendStatus(204)
    })

