import {injectable} from "inversify";
import {UsersService} from "../domain/users-service";
import {UsersDbQueryRepository} from "../repositories/users-db-query-repository";
import {Request, Response} from "express";

@injectable()
export class UsersController {
    constructor(protected usersService: UsersService,
                protected usersDbQueryRepository: UsersDbQueryRepository) {
    }

    async getUsers(req: Request, res: Response) {
        const sortBy = req.query.sortBy as string
        const sortDirection = req.query.sortDirection as string
        const pageNumber = req.query.pageNumber as string
        const pageSize = req.query.pageSize as string
        const searchLoginTerm = req.query.searchLoginTerm as string
        const searchEmailTerm = req.query.searchEmailTerm as string
        const users = await this.usersDbQueryRepository.getUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        res.status(200).send(users)
    }

    async createUser(req: Request, res: Response) {
        const login = req.body.login as string
        const password = req.body.password as string
        const email = req.body.email as string
        const newUser = await this.usersService.createUser(login, password, email)
        if ('id' in newUser) {
            res.status(201).send(newUser)
        } else {
            res.status(400).send(newUser)
        }
    }

    async deleteUser(req: Request, res: Response) {
        const id = req.params.id as string
        if (await this.usersService.deleteUser(id)) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}