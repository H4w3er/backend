import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../domain/users-service";
import {container} from "../composition-root";

const usersService = container.get(UsersService)
const jwtService = container.get(JwtService)

export const authRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const userIdFromToken = await jwtService.getIdFromToken(refreshToken)
    if(userIdFromToken.userId === null || !(await usersService.isTokenAllowed(refreshToken, userIdFromToken.userId))) {
        res.status(401).send("error")
    } else {
        next();
    }
}
