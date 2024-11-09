import {Router} from "express";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postsService} from "../domain/posts-service";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validation";

export const postsRouter = Router({})

postsRouter.get('/', async(req, res) => {
    // @ts-ignore
    let posts = await postsService.findPosts(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
    res.send(posts);
})

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req, res) => {
    const newPost = await postsService.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)
        res.status(201).send(newPost)
    })

postsRouter.get('/:id', async (req, res) => {
    let post = await postsService.findPostById(req.params.id)
    if (post){
        res.status(200).send(post)
    } else res.sendStatus(404);
})

postsRouter.put('/:id',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req, res) => {
    if(await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)) {
        res.sendStatus(204)
    } else res.sendStatus(404)
    })

postsRouter.delete('/:id', authMiddleware,
    async (req, res) => {
    if (await postsService.deletePost(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
