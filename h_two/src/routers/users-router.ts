import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {UsersController} from "./users-controller";
import {container} from "../composition-root";

export const usersRouter = Router({})

const usersController = container.get(UsersController)

usersRouter.get('/', authMiddleware, usersController.getUsers.bind(usersController))
usersRouter.post('/', authMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser.bind(usersController))
