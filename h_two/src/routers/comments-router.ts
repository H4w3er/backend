import {Router} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {commentsService} from "../domain/comments-service";
import {contentValidation} from "../middlewares/posts-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router()

commentsRouter.get('/:id', authBearerMiddleware,
    async (req, res) => {
    const comment = await commentsService.getCommentById(req.params.id)
        if (comment) res.status(200).send(comment)
        res.sendStatus(404)
})

commentsRouter.put('/:commentId',
    authBearerMiddleware,
    contentValidation,
    inputValidationMiddleware,
    async (req,res) => {
        const newComment = await commentsService.updateCommentById(req.params.commentId, req.body.content, req.user!._id)
        if (!newComment) res.sendStatus(404)
        if (newComment===1) res.sendStatus(403)
        res.sendStatus(204)
})

commentsRouter.delete('/:commentId',
    authBearerMiddleware,
    contentValidation,
    inputValidationMiddleware,
    async (req,res) => {
        const newComment = await commentsService.deleteCommentById(req.params.commentId, req.user!._id)
        if (!newComment) res.sendStatus(404)
        if (newComment===1) res.sendStatus(403)
        res.sendStatus(204)
    })

