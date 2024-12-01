import {Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";

export const authRouter = Router({})

authRouter.post('/login', async (req,res) =>{
    const checkUser = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkUser){
        const token = await jwtService.createJWT(checkUser)
        res.status(201).send({accessToken: token})
    } else {
        res.sendStatus(401)
    }
})
authRouter.get('/me', authBearerMiddleware, async (req, res) =>{
    const thisUser = {
        "email": req.user!.email,
        "login": req.user!.userName,
        "userId": req.user!._id,
    }
    res.status(200).send(thisUser)
})