import {body} from "express-validator";
import {blogsService} from "../domain/blogs-service";

export const nameValidation = body('name').trim().isLength({min:1, max:15}).withMessage("Name should be more than 1 and less than 15");
export const descriptionValidation = body('description').isLength({min:1, max:500}).withMessage("Description should be more than 1 and less than 500");
export const websiteUrlValidation = body('websiteUrl').isLength({min:1, max:100}).withMessage("Bad length").custom(value => {
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    return pattern.test(value);
}).withMessage("Bad URL")
export const blogIdValidation= body('blogId').custom(async value => {
    const check = await blogsService.isBlog(value);
    if (!check) throw new Error()
    return true;
}).withMessage("Blog not found")