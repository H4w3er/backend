import {Router, Request, Response} from "express";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {nameValidation, descriptionValidation, websiteUrlValidation,} from "../middlewares/blogs-validation"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validation";
import {blogQueryRepository} from "../repositories/blogs-db-query-repository";
import {postQueryRepository} from "../repositories/posts-db-query-repository";

export const blogsRouter = Router({})

class BlogsController {
    async getBlogs(req: Request, res: Response) {
        const id = req.query.id as string
        const searchNameTerm = req.query.searchNameTerm as string
        const sortBy = req.query.sortBy as string
        // @ts-ignore
        const foundBlog = await blogQueryRepository.findBlogs(id, searchNameTerm, sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
        res.send(foundBlog);
    }
    async createBlog(req: Request, res: Response) {
        const idOfNewBlog = await blogsService.createBlog(req.body.name, req.body.description,
            req.body.websiteUrl)
        const newBlog = await blogQueryRepository.findBlogsById(idOfNewBlog.toString())
        res.status(201).send(newBlog)
    }
    async getBlogById(req: Request, res: Response) {
        let blog = await blogQueryRepository.findBlogsById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
        } else res.sendStatus(404);
    }
    async updateBlog(req: Request, res: Response) {
        if (await blogsService.updateBlog(req.params.id, req.body.name, req.body.description,
            req.body.websiteUrl)) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }
    async deleteBlog(req: Request, res: Response) {
        if (await blogsService.deleteBlog(req.params.id)) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
    async getPostsForBlog(req: Request, res: Response) {
        if (await blogsService.isBlog(req.params.id)) {
            // @ts-ignore
            const foundPosts = await postQueryRepository.postsForBlog(req.params.id, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
            if (foundPosts) {
                res.status(200).send(foundPosts)
            }
            res.sendStatus(404)
        } else {
            res.sendStatus(404)
        }
    }
    async createPostForBlog(req: Request, res: Response) {
        if (await blogsService.isBlog(req.params.id)) {
            let post = await blogsService.createPostForBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content)
            if (post) {
                res.status(201).send(post)
            } else res.sendStatus(404);
        } else {
            res.sendStatus(404)
        }
    }
}

const blogsController = new BlogsController()

blogsRouter.get('/', blogsController.getBlogs)

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.createBlog)

blogsRouter.get('/:id', blogsController.getBlogById)

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.updateBlog)

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog)

blogsRouter.get('/:id/posts', blogsController.getPostsForBlog)

blogsRouter.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, blogsController.createPostForBlog)
