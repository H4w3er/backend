import {Router} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentCommentValidation} from "../middlewares/comments-validation";
import {CommentsController} from "./comments-controller";
import {container} from "../composition-root";

export const commentsRouter = Router()

const commentsController = container.get(CommentsController)

commentsRouter.get('/:id', authBearerMiddleware, commentsController.getCommentById.bind(commentsController))

commentsRouter.put('/:commentId', authBearerMiddleware, contentCommentValidation, inputValidationMiddleware, commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status', authBearerMiddleware, commentsController.updateLikeStatus.bind(commentsController))

commentsRouter.delete('/:id', authBearerMiddleware, commentsController.deleteComment.bind(commentsController))

