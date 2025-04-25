import {Router, Request, Response} from "express";
import {UsersService} from "../domain/users-service";
import {JwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {EmailAdapter} from "../adapters/emailAdapter";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/auth-validation";
import {AuthService} from "../domain/auth-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {SecurityDevicesService} from "../domain/securityDevices-service";
import {CRLChecking} from "../middlewares/CRL-cheking";
import {UserViewType} from "../db/user-type-db";

export const authRouter = Router({})

class AuthController{
    usersService: UsersService
    emailAdapter: EmailAdapter
    authService: AuthService
    securityDevicesService: SecurityDevicesService
    jwtService: JwtService
    constructor() {
        this.usersService = new UsersService()
        this.emailAdapter = new EmailAdapter()
        this.authService = new AuthService()
        this.securityDevicesService = new SecurityDevicesService()
        this.jwtService = new JwtService()
    }

    async login(req:Request, res: Response){
        const checkUser = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkUser){
            const token = await this.jwtService.createJWT(checkUser._id)
            const refreshToken = await this.jwtService.createRefreshToken(checkUser._id, null)
            const ip =  req.headers['x-forwarded-for'] as string
            const title =  req.headers['user-agent'] as string
            await this.securityDevicesService.addNewSession(ip, title, refreshToken.deviceId.toString(), checkUser._id, refreshToken.token)

            res.cookie('refreshToken', refreshToken.token, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: token})
        } else {
            res.sendStatus(401)
        }
    }
    async infoMe(req:Request, res: Response){
        const thisUser = {
            "email": req.user!.email,
            "login": req.user!.userName,
            "userId": req.user!._id,
        }
        res.status(200).send(thisUser)
    }
    async emailResending(req:Request, res: Response){
        const result = await this.authService.sendConfirmationLetter(req.body.email)
        if (result) res.sendStatus(204)
        else res.status(400).send({"errorsMessages": [
                {
                    "message": "something went wrong",
                    "field": "email"
                }]})
    }
    async registration(req:Request, res: Response){
        const newUser: UserViewType | Object = await this.authService.createUser(req.body.login, req.body.password, req.body.email)
        if('id' in newUser) {
            res.sendStatus(204)
        }
        else{
            res.status(400).send(newUser)
        }
    }
    async registrationConfirmation(req:Request, res: Response){
        const verify = await this.emailAdapter.checkCode(req.body.code)
        if (verify) res.sendStatus(204)
        else res.status(400).send({"errorsMessages": [
                {
                    "message": "wrong code",
                    "field": "code"
                }]})
    }
    async refreshToken(req:Request, res: Response){
        const refreshToken = req.cookies.refreshToken;
        const verifiedToken = await this.jwtService.getIdFromToken(refreshToken)
        if (!verifiedToken) {
            res.sendStatus(401)
        } else {
            await this.usersService.addToBlackList(refreshToken, verifiedToken.userId)
            const newToken = await this.jwtService.createJWT(verifiedToken.userId)
            const newRefreshToken = await this.jwtService.createRefreshToken(verifiedToken.userId, verifiedToken.deviceId)
            await this.securityDevicesService.sessionUpdate(verifiedToken.userId, verifiedToken.deviceId, newRefreshToken.token)
            res.cookie('refreshToken', newRefreshToken.token, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: newToken})
        }
    }
    async logout(req:Request, res: Response){
        const refreshToken = req.cookies.refreshToken;
        const verifiedToken = await this.jwtService.getIdFromToken(refreshToken)
        if (!verifiedToken.userId) {
            res.sendStatus(401)
        } else {
            await this.usersService.addToBlackList(refreshToken, verifiedToken.userId)
            await this.securityDevicesService.deleteSessionByDeviceId(verifiedToken.deviceId, verifiedToken.userId)
            res.sendStatus(204)
        }
    }
}

const authController = new AuthController()

authRouter.post('/login', CRLChecking, authController.login.bind(authController))

authRouter.get('/me', authBearerMiddleware, authController.infoMe.bind(authController))

authRouter.post('/registration-email-resending', CRLChecking, emailValidation, inputValidationMiddleware, authController.emailResending.bind(authController))

authRouter.post('/registration', CRLChecking, loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-confirmation', CRLChecking, authController.registrationConfirmation.bind(authController))

authRouter.post('/refresh-token', authRefreshMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/logout', authRefreshMiddleware, authController.logout.bind(authController))