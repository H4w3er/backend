import {Router} from "express";
import {usersQueryRepository} from "../repositories/users-db-query-repository";
import {authMiddleware} from "../middlewares/authMiddleware";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})


usersRouter.get('/',
    authMiddleware,
    async (req, res) =>{
    // @ts-ignore
    const users = await usersQueryRepository.getUsers(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize, req.query.searchLoginTerm, req.query.searchEmailTerm)
    res.sendStatus(200).send(users)
})
usersRouter.post('/',
    authMiddleware,
    async (req, res) => {
    const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    res.sendStatus(201).send(newUser)
})
usersRouter.delete('/:id',
    authMiddleware,
    async (req, res) =>{
    if (await usersService.deletePost(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})