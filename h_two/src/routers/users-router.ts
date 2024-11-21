import {Router} from "express";
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/users-db-query-repository";
import {authMiddleware} from "../middlewares/authMiddleware";

export const usersRouter = Router({})


usersRouter.get('/',
    authMiddleware,
    (req, res) =>{
    // @ts-ignore
    const users = usersQueryRepository.getUsers(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize, req.query.searchLoginTerm, req.query.searchEmailTerm)
    res.sendStatus(200).send(users)
})
usersRouter.post('/',
    authMiddleware,
    (req, res) =>{

})
usersRouter.delete('/:id',
    authMiddleware,
    (req, res) =>{

})