import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    const check = await usersService.isTokenAllowed(refreshToken, userId)
    if(!check) {
        res.status(401).send("error")
    } else {
        next();
        return;
    }
}
