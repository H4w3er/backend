import {Container} from "inversify";
import {BlogsDbRepository} from "./repositories/blogs-db-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routers/blogs-controller";
import {PostsDbRepository} from "./repositories/posts-db-repository";
import {BlogsDbQueryRepository} from "./repositories/blogs-db-query-repository";
import {PostsController} from "./routers/posts-controller";

import {CommentsController} from "./routers/comments-controller";
import {CommentsDbRepository} from "./repositories/comments-db-repository";
import {CommentsService} from "./domain/comments-service";
import {UsersController} from "./routers/users-controller";
import {UsersDbQueryRepository} from "./repositories/users-db-query-repository";
import {UsersService} from "./domain/users-service";
import {UsersDbRepository} from "./repositories/users-db-repository";
import {EmailAdapter} from "./adapters/emailAdapter";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./routers/auth-controller";
import {JwtService} from "./application/jwt-service";
import {SecurityDevicesService} from "./domain/securityDevices-service";
import {SecurityDevicesDbRepository} from "./repositories/securityDevices-db-repository";
import {SecurityDevicesController} from "./routers/security-devices-controller";
import {PostsService} from "./domain/posts-service";
import {PostsDbQueryRepository} from "./repositories/posts-db-query-repository";

/*const objects: any[] = []
const blogDbRepository = new BlogsDbRepository()
const blogsService = new BlogsService(blogDbRepository)
export const blogsController = new BlogsController(blogsService)
*/

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsDbRepository).to(BlogsDbRepository)
container.bind(BlogsDbQueryRepository).to(BlogsDbQueryRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsDbRepository).to(PostsDbRepository)
container.bind(PostsDbQueryRepository).to(PostsDbQueryRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsDbRepository).to(CommentsDbRepository)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersDbRepository).to(UsersDbRepository)
container.bind(UsersDbQueryRepository).to(UsersDbQueryRepository)

container.bind(EmailAdapter).to(EmailAdapter)
container.bind(JwtService).to(JwtService)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(SecurityDevicesDbRepository).to(SecurityDevicesDbRepository)


