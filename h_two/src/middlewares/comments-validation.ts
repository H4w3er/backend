import {body} from "express-validator";

export const contentCommentValidation = body('content').trim().isLength({min:20, max:300}).withMessage("Content should be more than 20 and less than 300");
