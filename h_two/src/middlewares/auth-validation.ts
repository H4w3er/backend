import {body, param} from "express-validator";


export const loginValidation = body('login').isLength({min:3, max:10}).withMessage("Bad length").custom(value => {
    const pattern = /^[a-zA-Z0-9_-]*$/
    if (!(pattern.test(value))) throw new Error()
    return true
}).withMessage("Only letters and numbers")
export const emailValidation = body('email').custom(value => {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (!(pattern.test(value))) throw new Error()
    return true
}).withMessage("Wrong email")
export const passwordValidation = body('password').isLength({min:6, max:20}).withMessage("Password should be more than 6 and less than 20");
export const newPasswordValidation = body('newPassword').isLength({min:6, max:20}).withMessage("Password should be more than 6 and less than 20");

