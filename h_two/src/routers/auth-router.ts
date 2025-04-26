import {Router} from "express";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/auth-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authRefreshMiddleware} from "../middlewares/authRefreshMiddleware";
import {CRLChecking} from "../middlewares/CRL-cheking";
import {AuthController} from "./auth-controller";
import {container} from "../composition-root";

export const authRouter = Router({})

const authController = container.get(AuthController)

authRouter.post('/login', CRLChecking, authController.login.bind(authController))

authRouter.get('/me', authBearerMiddleware, authController.infoMe.bind(authController))

authRouter.post('/registration-email-resending', CRLChecking, emailValidation, inputValidationMiddleware, authController.emailResending.bind(authController))

authRouter.post('/registration', CRLChecking, loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-confirmation', CRLChecking, authController.registrationConfirmation.bind(authController))

authRouter.post('/refresh-token', authRefreshMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/logout', authRefreshMiddleware, authController.logout.bind(authController))