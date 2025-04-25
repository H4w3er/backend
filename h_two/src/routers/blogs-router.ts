import {Router, Request, Response} from "express";
import {BlogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {nameValidation, descriptionValidation, websiteUrlValidation,} from "../middlewares/blogs-validation"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validation";
import {BlogsDbQueryRepository} from "../repositories/blogs-db-query-repository";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";

export const blogsRouter = Router({})

class BlogsController {
    blogsDbQueryRepository: BlogsDbQueryRepository
    postsDbQueryRepository: PostsDbQueryRepository
    blogsService: BlogsService
    constructor() {
        this.blogsDbQueryRepository = new BlogsDbQueryRepository()
        this.postsDbQueryRepository = new PostsDbQueryRepository()
        this.blogsService = new BlogsService()
    }

    async getBlogs(req: Request, res: Response) {
        const id = req.query.id as string
        const searchNameTerm = req.query.searchNameTerm as string
        const sortBy = req.query.sortBy as string
        // @ts-ignore
        const foundBlog = await blogQueryRepository.findBlogs(id, searchNameTerm, sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
        res.send(foundBlog);
    }
    async createBlog(req: Request, res: Response) {
        const idOfNewBlog = await this.blogsService.createBlog(req.body.name, req.body.description,
            req.body.websiteUrl)
        const newBlog = await this.blogsDbQueryRepository.findBlogsById(idOfNewBlog.toString())
        res.status(201).send(newBlog)
    }
    async getBlogById(req: Request, res: Response) {
        let blog = await this.blogsDbQueryRepository.findBlogsById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
        } else res.sendStatus(404);
    }
    async updateBlog(req: Request, res: Response) {
        if (await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.description,
            req.body.websiteUrl)) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }
    async deleteBlog(req: Request, res: Response) {
        if (await this.blogsService.deleteBlog(req.params.id)) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
    async getPostsForBlog(req: Request, res: Response) {
        if (await this.blogsService.isBlog(req.params.id)) {
            // @ts-ignore
            const foundPosts = await this.postsDbQueryRepository.postsForBlog(req.params.id, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
            if (foundPosts) {
                res.status(200).send(foundPosts)
            }
            res.sendStatus(404)
        } else {
            res.sendStatus(404)
        }
    }
    async createPostForBlog(req: Request, res: Response) {
        if (await this.blogsService.isBlog(req.params.id)) {
            let post = await this.blogsService.createPostForBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content)
            if (post) {
                res.status(201).send(post)
            } else res.sendStatus(404);
        } else {
            res.sendStatus(404)
        }
    }
}

const blogsController = new BlogsController()

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.getPostsForBlog.bind(blogsController))

blogsRouter.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, blogsController.createPostForBlog.bind(blogsController))
