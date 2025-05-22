import {injectable} from "inversify";
import {PostsService} from "../domain/posts-service";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {JwtService} from "../application/jwt-service";

@injectable()
export class PostsController {
    constructor(protected postsService: PostsService,
                protected postDbQueryRepository: PostsDbQueryRepository,
                protected commentsService: CommentsService,
                protected jwtService: JwtService) {
    }

    async getPosts(req: Request, res: Response) {
        const sortBy = req.query.sortBy as string
        const sortDirection = req.query.sortDirection as string
        const pageNumber = req.query.pageNumber as string
        const pageSize = req.query.pageSize as string
        const authToken = req.headers.authorization as string
        let user = null
        let posts = null
        if (authToken) {
            user = await this.jwtService.getIdFromToken(authToken.split(' ')[1] as string)
        }
        if (!user || !user.userId) posts = await this.postDbQueryRepository.findPosts(sortBy, sortDirection, pageNumber, pageSize, 'nothing')
        else posts = await this.postDbQueryRepository.findPosts(sortBy, sortDirection, pageNumber, pageSize, user.userId)
        res.status(200).send(posts);
    }

    async createPost(req: Request, res: Response) {
        const newPostId = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        if (newPostId == 'not found') res.sendStatus(401)
        else {
            const newPost = await this.postDbQueryRepository.findPostById(newPostId.toString(), 'nothing')
            res.status(201).send(newPost)
        }
    }

    async getPostById(req: Request, res: Response) {
        const authToken = req.headers.authorization as string
        let user = null
        let post = null
        if (authToken) {
            user = await this.jwtService.getIdFromToken(authToken.split(' ')[1] as string)
        }
        if (!user.userId) post = await this.postDbQueryRepository.findPostById(req.params.id, 'nothing')
        else  post = await this.postDbQueryRepository.findPostById(req.params.id, user.userId)
        if (post) {
            res.status(200).send(post)
        } else res.sendStatus(404);
    }

    async updatePost(req: Request, res: Response) {
        if (await this.postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    }

    async deletePost(req: Request, res: Response) {
        if (await this.postsService.deletePost(req.params.id)) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async createCommentForPost(req: Request, res: Response) {
        let post = await this.postDbQueryRepository.findPostById(req.params.postId, 'nothing')
        if (!post) {
            res.sendStatus(404);
        } else {
            const comment = await this.commentsService.createComment(req.params.postId, req.body.content, req.user!._id, req.user!.userName)
            res.status(201).send(comment)
        }
    }

    async getCommentsForPost(req: Request, res: Response) {
        let post = await this.postDbQueryRepository.findPostById(req.params.postId, 'nothing')
        const authToken = req.headers.authorization as string
        if (!post) {
            res.sendStatus(404);
        } else {
            const comments = await this.commentsService.getCommentForPost(req.params.postId, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize, authToken)
            if (!comments) {
                res.sendStatus(404)
            } else {
                res.status(200).send(comments)
            }
        }
    }

    async updatedLikeStatus(req: Request, res: Response) {
        const likeStatus = req.body.likeStatus
        const userId = req.user!._id
        const userLogin = req.user.userName
        const postId = req.params.id
        const response = await this.postsService.updatedLikeStatus(likeStatus, userId, postId, userLogin)
        if (response === "not found") res.sendStatus(404)
        else res.sendStatus(204)
    }
}