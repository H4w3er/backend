import {Router} from "express";
import {postsRepository} from "../repositories/posts-db-repository";
import {body, validationResult} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {ObjectId} from "mongodb";
import {blogCollection, postCollection} from "../db/mongo-db";

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
    let posts = await postsRepository.findPosts()
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
    const id:ObjectId = req.body.blogId;
    const blogId = new ObjectId(id)
    const found = await blogCollection.findOne({_id: blogId})
        const blogName = found?.name
        if (blogName != null) {
            const newPost = await postsRepository.createPost(req.body.title, req.body.shortDescription,
                req.body.content, req.body.blogId, blogName)
            res.status(201).send(newPost)
        } else throw new Error('wtf')
    })

postsRouter.get('/:id', async (req, res) => {
    const id = new ObjectId(req.params.id);
    let post = await postsRepository.findPostById(id)
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
    const id = new ObjectId(req.params.id);
    if(await postsRepository.updatePost(id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)) {
        res.sendStatus(204)
    } else res.sendStatus(404)
    })

postsRouter.delete('/:id', authMiddleware,
    async (req, res) => {
    const id = new ObjectId(req.params.id);
    if (await postsRepository.deletePost(id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
