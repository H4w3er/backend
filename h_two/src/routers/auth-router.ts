import {Router} from "express";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/login', async (req,res) =>{
    const checkUser = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkUser){
        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
})