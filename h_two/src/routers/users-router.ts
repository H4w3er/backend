import {Router} from "express";
import {usersQueryRepository} from "../repositories/users-db-query-repository";
import {usersService} from "../domain/users-service";
import {authMiddleware} from "../middlewares/authMiddleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/users-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({})


usersRouter.get('/',
    authMiddleware,
    async (req, res) =>{
    // @ts-ignore
    const users = await usersQueryRepository.getUsers(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize, req.query.searchLoginTerm, req.query.searchEmailTerm)
    res.status(200).send(users)
})
usersRouter.post('/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req, res) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        if(newUser == 1) {
            res.status(400).send({"errorsMessages": [
                    {
                        "message": "the login is not unique",
                        "field": "login"
                    }]})
        }
        if(newUser == 2){
            res.status(400).send({"errorsMessages":[
                    {
                        "message": "the email address is not unique",
                        "field": "email"
                    }]})
        } else{
            res.status(201).send(newUser)
        }
    })
usersRouter.delete('/:id',
    authMiddleware,
    async (req, res) =>{
    if (await usersService.deleteUser(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})