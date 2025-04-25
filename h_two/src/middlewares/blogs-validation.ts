import {body, param} from "express-validator";
import {BlogsService} from "../domain/blogs-service";

const blogsService = new BlogsService()

export const nameValidation = body('name').trim().isLength({min:1, max:15}).withMessage("Name should be more than 1 and less than 15");
export const descriptionValidation = body('description').isLength({min:1, max:500}).withMessage("Description should be more than 1 and less than 500");
export const websiteUrlValidation = body('websiteUrl').isLength({min:1, max:100}).withMessage("Bad length").custom(value => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    return pattern.test(value);
}).withMessage("Bad URL")
export const blogIdValidation= param('id').custom(async value => {
    const check = await blogsService.isBlog(value);
    if (!check) throw new Error()
    return true;
}).withMessage("Blog not found")