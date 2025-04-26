import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {descriptionValidation, nameValidation, websiteUrlValidation,} from "../middlewares/blogs-validation"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validation";
import {container} from "../composition-root";
import {BlogsController} from "./blogs-controller";

export const blogsRouter = Router({})

const blogsController = container.get(BlogsController)

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.getPostsForBlog.bind(blogsController))

blogsRouter.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, blogsController.createPostForBlog.bind(blogsController))
