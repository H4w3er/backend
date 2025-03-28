import {Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {emailAdapter} from "../adapters/emailAdapter";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/auth-validation";
import {authService} from "../domain/auth-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {SETTINGS} from "../settings";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {securityDevicesService} from "../domain/securityDevices-service";

export const authRouter = Router({})

authRouter.post('/login', async (req,res) =>{
    const checkUser = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkUser){
        const token = await jwtService.createJWT(checkUser._id)
        const refreshToken = await jwtService.createRefreshToken(checkUser._id, req.headers['user-agent'])
        await securityDevicesService.addNewSession('1', req.headers['user-agent'], '1',refreshToken.deviceId, new Date(), new Date(new Date().setSeconds(new Date().getSeconds() + 20)).toISOString())
        res.cookie('refreshToken', refreshToken.token, {httpOnly: true, secure: true, path: SETTINGS.PATH.AUTH})
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
        res.sendStatus(204)
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
/*authRouter.post('/refresh-token', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    if (!userId) {
        res.sendStatus(401)
    } else {
        await usersService.addToBlackList(refreshToken, userId)
        const newToken = await jwtService.createJWT(userId)
        const newRefreshToken = await jwtService.createRefreshToken(userId)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true, path: SETTINGS.PATH.AUTH})
        res.status(200).send({accessToken: newToken})
    }
})*/
authRouter.post('/logout', authRefreshMiddleware, async(req, res)=>{
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getIdByToken(refreshToken)
    if (!userId) {
        res.sendStatus(401)
    } else {
        await usersService.addToBlackList(refreshToken, userId)
        res.sendStatus(204)
    }
})