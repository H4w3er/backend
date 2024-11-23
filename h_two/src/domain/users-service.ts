import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from "bcrypt";

export const usersService = {
    async createUser(login: string, password: string, email: string) {
        const bcrypt = require('bcrypt')
        const passwordSalt = await bcrypt.genSalt(10)

        const newUser = {
            login: login,
            password: password,
            email: email,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },
    async deletePost(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    }
}