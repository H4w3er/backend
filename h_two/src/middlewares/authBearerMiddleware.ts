import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization as string
    if (!auth) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization?.split(' ')[1]
    const userId = await jwtService.getIdByToken(token)
    if (userId){
        req.user = await usersService.findUserById(userId)
        next()
        return
    }
    res.sendStatus(401)
}