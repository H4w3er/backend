import {body} from "express-validator";

export const loginValidation = body('login').trim().isLength({min:3, max:10}).withMessage("Login should be more than 3 and less than 10");
export const passwordValidation = body('password').isLength({min:6, max:20}).withMessage("Password should be more than 6 and less than 20");
export const emailValidation = body('email').custom(value => {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return pattern.test(value);
}).withMessage("Email should be correct")
