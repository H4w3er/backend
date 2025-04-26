import {Container} from "inversify";
import {UsersController} from "./routers/users-router";
import {BlogsDbRepository} from "./repositories/blogs-db-repository";
import {BlogsService} from "./domain/blogs-service";

import {BlogsController} from "./routers/blogs-controller";

const objects: any[] = []

const blogDbRepository = new BlogsDbRepository()
const blogsService = new BlogsService(blogDbRepository)
export const blogsController = new BlogsController(blogsService)

//export const container = new Container()

//container.bind(UsersController).to(UsersController)