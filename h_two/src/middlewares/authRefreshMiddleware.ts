import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const userIdFromToken = await jwtService.getIdFromToken(refreshToken)
    if(userIdFromToken.userId === null || !(await usersService.isTokenAllowed(refreshToken, userIdFromToken.userId))) {
        res.status(401).send("error")
    } else {
        next();
    }
}
