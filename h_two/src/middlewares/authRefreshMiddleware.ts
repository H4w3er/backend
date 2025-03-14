import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authRefreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization as string;
    if (!auth) {
        res.sendStatus(401);
        return;
    }
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    const check = await usersService.isTokenAllowed(refreshToken, userId)
    //console.log(await usersService.findUserById(userId))
    if(!check) {
        res.sendStatus(401)
    } else {
        next();
        return;
    }
}
