import {Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {nameValidation, descriptionValidation, websiteUrlValidation,} from "../middlewares/blogs-validation"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/posts-validation";
import {blogQueryRepository} from "../repositories/blogs-db-query-repository";
import {postQueryRepository} from "../repositories/posts-db-query-repository";

export const blogsRouter = Router({})

blogsRouter.get('/',
    async (req, res) => {
    // @ts-ignore
        const foundBlog = await blogQueryRepository.findBlogs(req.query.id, req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
    res.send(foundBlog);
})

blogsRouter.post('/',
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req, res) => {
    const idOfNewBlog = await blogsService.createBlog(req.body.name, req.body.description,
        req.body.websiteUrl)
    const newBlog = await blogQueryRepository.findBlogsById(idOfNewBlog.toString())
    res.status(201).send(newBlog)
})

blogsRouter.get('/:id',
    async (req, res) => {
    let blog = await blogQueryRepository.findBlogsById(req.params.id)
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

blogsRouter.get('/:id/posts',
    async (req,res) => {
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
})

blogsRouter.post('/:id/posts',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req, res) => {
    if (await blogsService.isBlog(req.params.id)) {
        let post = await blogsService.createPostForBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content)
        if (post) {
            res.status(201).send(post)
        } else res.sendStatus(404);
    } else {
        res.sendStatus(404)
    }
})

//маппер перенести в query repo
//добавить query repo для get запросов, он только для present слоя
//крч все get через query делать, если в post нужно вернуть созданный обЪект то P->B->D, D возвращает id, потом P делает get запрос
