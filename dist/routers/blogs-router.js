"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.blogsRouter = (0, express_1.Router)({});
const nameValidation = (0, express_validator_1.body)('name').isLength({ min: 1, max: 15 }).withMessage("Name should be more than 1 and less than 15");
const descriptionValidation = (0, express_validator_1.body)('description').isLength({ min: 1, max: 500 }).withMessage("Description should be more than 1 and less than 500");
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isLength({ min: 1, max: 100 }).custom(value => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    return pattern.test(value);
}).withMessage("Bad URL");
exports.blogsRouter.get('/', (req, res) => {
    let blogs = blogs_repository_1.blogsRepository.findBlogs();
    res.send(blogs);
});
exports.blogsRouter.post('/', nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(newBlog);
});
exports.blogsRouter.get('/:id', (req, res) => {
    let blog = blogs_repository_1.blogsRepository.findBlogsById(req.params.id);
    if (blog) {
        res.status(200).send(blog);
    }
    else
        res.sendStatus(404);
});
exports.blogsRouter.put('/:id', nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    if (blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
});
exports.blogsRouter.delete('/:id', (req, res) => {
    if (blogs_repository_1.blogsRepository.deleteBlog(req.params.id)) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
