import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validation";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {contentCommentValidation} from "../middlewares/comments-validation";
import {PostsController} from "./posts-controller";
import {container} from "../composition-root";

export const postsRouter = Router({})

const postsController = container.get(PostsController)

postsRouter.get('/', postsController.getPosts.bind(postsController))

postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, postsController.createPost.bind(postsController))

postsRouter.get('/:id', postsController.getPostById.bind(postsController))

postsRouter.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, postsController.updatePost.bind(postsController))

postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController))

postsRouter.post('/:postId/comments', authBearerMiddleware, contentCommentValidation, inputValidationMiddleware, postsController.createCommentForPost.bind(postsController))

postsRouter.get('/:postId/comments', postsController.getCommentsForPost.bind(postsController))
