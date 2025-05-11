import {Router} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {contentCommentValidation, likeStatusValidation} from "../middlewares/comments-validation";
import {CommentsController} from "./comments-controller";
import {container} from "../composition-root";

export const commentsRouter = Router()

const commentsController = container.get(CommentsController)

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))

commentsRouter.put('/:commentId', authBearerMiddleware, contentCommentValidation, inputValidationMiddleware, commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status', authBearerMiddleware, likeStatusValidation, inputValidationMiddleware, commentsController.updateLikeStatus.bind(commentsController))

commentsRouter.delete('/:id', authBearerMiddleware, commentsController.deleteComment.bind(commentsController))

