import {Router} from "express";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postsService} from "../domain/posts-service";

const titleValidation = body('title').trim().isLength({min:1, max:30}).withMessage("Title should be more than 1 and less than 30");
const shortDescriptionValidation = body('shortDescription').isLength({min:1, max:100}).withMessage("shortDescription should be more than 1 and less than 100");
const contentValidation = body('content').trim().isLength({min:1, max:1000}).withMessage("Content should be more than 1 and less than 1000")
const blogIdValidation= body('blogId').custom(async value => {
    const check = await blogsRepository.isBlog(value);
    if (!check) throw new Error()
    return true;
}).withMessage("Blog not found")

export const postsRouter = Router({})

postsRouter.get('/', async(req, res) => {
    let posts = await postsService.findPosts()
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
