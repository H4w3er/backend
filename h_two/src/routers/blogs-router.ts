import {Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {nameValidation, descriptionValidation, websiteUrlValidation} from "../middlewares/blogs-validation"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validation";

export const blogsRouter = Router({})

blogsRouter.get('/',
    async (req, res) => {
    // @ts-ignore
        const foundBlog = await blogsService.findBlogs(req.query.id, req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
    res.send(foundBlog);
})

blogsRouter.post('/',
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req, res) => {
    const newBlog = await blogsService.createBlog(req.body.name, req.body.description,
        req.body.websiteUrl)
    res.status(201).send(newBlog)
})

blogsRouter.get('/:id',
    async (req, res) => {
    let blog = await blogsService.findBlogsById(req.params.id)
    if (blog){
        res.status(200).send(blog)
    } else res.sendStatus(404);
})

blogsRouter.put('/:id',
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req, res) => {
    if(await blogsService.updateBlog(req.params.id, req.body.name, req.body.description,
        req.body.websiteUrl)) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})

blogsRouter.delete('/:id', authMiddleware,
    async (req, res) => {
    if (await blogsService.deleteBlog(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.get('/:id/posts', async (req,res) => {
    // @ts-ignore
    const foundPosts = await blogsService.postsForBlog(req.params.id, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
    if (foundPosts) res.status(200).send(foundPosts)
    else res.sendStatus(404)
})

blogsRouter.post('/:id/posts',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req, res) => {
    let post = await blogsService.createPostForBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content)
        if (post){
            res.status(201).send(post)
    } else res.sendStatus(404);
})
