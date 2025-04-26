import {body} from "express-validator";
import {container} from "../composition-root";
import {BlogsService} from "../domain/blogs-service";

const blogsService = container.get(BlogsService)

export const titleValidation = body('title').trim().isLength({min:1, max:30}).withMessage("Title should be more than 1 and less than 30");
export const shortDescriptionValidation = body('shortDescription').isLength({min:1, max:100}).withMessage("shortDescription should be more than 1 and less than 100");
export const contentValidation = body('content').trim().isLength({min:1, max:1000}).withMessage("Content should be more than 1 and less than 1000")
export const blogIdValidation= body('blogId').custom(async value => {
    const check = await blogsService.isBlog(value);
    if (!check) throw new Error()
    return true;
}).withMessage("Blog not found")