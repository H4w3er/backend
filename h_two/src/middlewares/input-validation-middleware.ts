import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    const errors = result.array({onlyFirstError: true});
    if (!result.isEmpty()) {
        //@ts-ignore
        res.status(400).json({errorsMessages: errors.map(c => {return {message: c.msg, field:c?.path }})});
    } else {
        next();
    }
}