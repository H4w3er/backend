import {Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
/*import {body, validationResult} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";


const nameValidation = body('name').trim().isLength({min:1, max:15}).withMessage("Name should be more than 1 and less than 15");
const descriptionValidation = body('description').isLength({min:1, max:500}).withMessage("Description should be more than 1 and less than 500");
const websiteUrlValidation = body('websiteUrl').isLength({min:1, max:100}).withMessage("Bad length").custom(value => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    return pattern.test(value);
}).withMessage("Bad URL")*/

export const postsRouter = Router({})
postsRouter.get('/', (req, res) => {
    let posts = postsRepository.findPosts()
    res.send(posts);
})
postsRouter.post('/',
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
    (req, res) => {
        if(postsRepository.updatePost(req.params.id, req.body.name, req.body.description,
            req.body.websiteUrl)) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })
/*
postsRouter.delete('/:id', authMiddleware,  (req, res) => {
    if (blogsRepository.deleteBlog(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
*/