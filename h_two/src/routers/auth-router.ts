import {Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {emailAdapter} from "../adapters/emailAdapter";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/auth-validation";
import {authService} from "../domain/auth-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const authRouter = Router({})

authRouter.post('/login', async (req,res) =>{
    const checkUser = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkUser){
        const token = await jwtService.createJWT(checkUser)
        res.status(200).send({accessToken: token})
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
authRouter.post('/registration-email-resending', emailValidation, inputValidationMiddleware, async (req, res) =>{
    const result = await authService.sendConfirmationLetter(req.body.email)
    if (result) res.sendStatus(204)
    else res.status(400).send({"errorsMessages": [
            {
                "message": "something went wrong",
                "field": "email"
            }]})
})
authRouter.post('/registration', loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, async (req, res) =>{
    const newUser = await authService.createUser(req.body.login, req.body.password, req.body.email)
    if(newUser === 1) {
        res.status(400).send({"errorsMessages": [
                {
                    "message": "the login is not unique",
                    "field": "login"
                }]})
    }
    else if(newUser == 2){
        res.status(400).send({"errorsMessages":[
                {
                    "message": "the email address is not unique",
                    "field": "email"
                }]})
    } else{
        res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address.")
    }
})
authRouter.post('/registration-confirmation', async (req, res) =>{
    const verify = await emailAdapter.checkCode(req.body.code)
    if (verify) res.sendStatus(204)
    else res.status(400).send({"errorsMessages": [
            {
                "message": "wrong code",
                "field": "code"
            }]})
})