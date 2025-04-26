import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../domain/users-service";
import {container} from "../composition-root";

const usersService = container.get(UsersService)
const jwtService = container.get(JwtService)

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization as string
    if (!auth) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization?.split(' ')[1] as string
    const userIdFromToken = await jwtService.getIdFromToken(token)
    if (userIdFromToken.userId){
        req.user = await usersService.findUserById(userIdFromToken.userId)
        next()
        return
    }
    res.sendStatus(401)
}