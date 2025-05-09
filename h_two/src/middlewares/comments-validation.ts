import {body, param} from "express-validator";

export const contentCommentValidation = body('content').trim().isLength({min:20, max:300}).withMessage("Content should be more than 20 and less than 300");
export const postIdCommentValidation = param('postId').trim().isLength({min:24, max:24}).withMessage("Post id should be 24 characters length");
export const likeStatusValidation = body('likeStatus').trim().custom(async value => {
    if (value !== 'None' || value !== 'Like' || value !== 'Dislike') throw new Error('Cant send it')
    return true
})
