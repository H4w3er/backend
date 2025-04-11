import {Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {emailAdapter} from "../adapters/emailAdapter";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/auth-validation";
import {authService} from "../domain/auth-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {securityDevicesService} from "../domain/securityDevices-service";
import {CRLChecking} from "../middlewares/CRL-cheking";
import {UserViewType} from "../db/user-type-db";

export const authRouter = Router({})

authRouter.post('/login', CRLChecking, async (req,res) =>{
    const checkUser = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkUser){
        const token = await jwtService.createJWT(checkUser._id)
        const refreshToken = await jwtService.createRefreshToken(checkUser._id, null)
        const ip =  req.headers['x-forwarded-for'] as string
        const title =  req.headers['user-agent'] as string
        await securityDevicesService.addNewSession(ip, title, refreshToken.deviceId.toString(), checkUser._id, refreshToken.token)

        res.cookie('refreshToken', refreshToken.token, {httpOnly: true, secure: true})
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
authRouter.post('/registration-email-resending', CRLChecking, emailValidation, inputValidationMiddleware, async (req, res) =>{
    const result = await authService.sendConfirmationLetter(req.body.email)
    if (result) res.sendStatus(204)
    else res.status(400).send({"errorsMessages": [
            {
                "message": "something went wrong",
                "field": "email"
            }]})
})
authRouter.post('/registration', CRLChecking, loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, async (req, res) =>{
    const newUser: UserViewType | Object = await authService.createUser(req.body.login, req.body.password, req.body.email)
    if('id' in newUser) {
        res.sendStatus(204)
    }
    else{
        res.status(400).send(newUser)
    }
})
authRouter.post('/registration-confirmation', CRLChecking, async (req, res) =>{
    const verify = await emailAdapter.checkCode(req.body.code)
    if (verify) res.sendStatus(204)
    else res.status(400).send({"errorsMessages": [
            {
                "message": "wrong code",
                "field": "code"
            }]})
})
authRouter.post('/refresh-token', authRefreshMiddleware, async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    const verifiedToken = await jwtService.getIdFromToken(refreshToken)
    if (!verifiedToken) {
        res.sendStatus(401)
    } else {
        await usersService.addToBlackList(refreshToken, verifiedToken.userId)
        const newToken = await jwtService.createJWT(verifiedToken.userId)
        const newRefreshToken = await jwtService.createRefreshToken(verifiedToken.userId, verifiedToken.deviceId)
        await securityDevicesService.sessionUpdate(verifiedToken.userId, verifiedToken.deviceId, newRefreshToken.token)
        res.cookie('refreshToken', newRefreshToken.token, {httpOnly: true, secure: true})
        res.cookie('deviceId', newRefreshToken.deviceId, {httpOnly: true, secure: true})
        res.status(200).send({accessToken: newToken})
    }
})
authRouter.post('/logout', authRefreshMiddleware, async(req, res)=>{
    const refreshToken = req.cookies.refreshToken;
    const verifiedToken = await jwtService.getIdFromToken(refreshToken)
    if (!verifiedToken.userId) {
        res.sendStatus(401)
    } else {
        await usersService.addToBlackList(refreshToken, verifiedToken.userId)
        await securityDevicesService.deleteSessionByDeviceId(verifiedToken.deviceId, verifiedToken.userId)
        res.sendStatus(204)
    }
})