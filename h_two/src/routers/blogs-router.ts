import {Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body, validationResult} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";

export const blogsRouter = Router({})

const nameValidation = body('name').trim().isLength({min:1, max:15}).withMessage("Name should be more than 1 and less than 15");
const descriptionValidation = body('description').isLength({min:1, max:500}).withMessage("Description should be more than 1 and less than 500");
const websiteUrlValidation = body('websiteUrl').isLength({min:1, max:100}).withMessage("Bad length").custom(value => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    return pattern.test(value);
}).withMessage("Bad URL")

blogsRouter.get('/',
    async (req, res) => {
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

