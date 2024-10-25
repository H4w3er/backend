import {Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body, validationResult} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";


const titleValidation = body('title').trim().isLength({min:1, max:30}).withMessage("Title should be more than 1 and less than 30");
const shortDescriptionValidation = body('shortDescription').isLength({min:1, max:100}).withMessage("shortDescription should be more than 1 and less than 100");
const contentValidation = body('content').isLength({min:1, max:1000}).withMessage("Content should be more than 1 and less than 1000")
const  blogIdValidation= body('blogId').custom(value => {
    return postsRepository.isBlog(value);
}).withMessage("Blog not found")

export const postsRouter = Router({})

postsRouter.get('/', (req, res) => {
    let posts = postsRepository.findPosts()
    res.send(posts);
})
postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req, res) => {
        const newPost = postsRepository.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        res.status(201).send(newPost)
    })

postsRouter.get('/:id', (req, res) => {
    let blog = postsRepository.findPostById(req.params.id)
    if (blog){
        res.status(200).send(blog)
    } else res.sendStatus(404);
})
postsRouter.put('/:id',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req, res) => {
        if(postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

postsRouter.delete('/:id', authMiddleware,
    (req, res) => {
    if (postsRepository.deletePost(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
