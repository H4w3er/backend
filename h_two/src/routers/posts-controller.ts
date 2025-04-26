import {injectable} from "inversify";
import {PostsService} from "../domain/posts-service";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";

@injectable()
export class PostsController {
    constructor(protected postsService: PostsService,
                protected postDbQueryRepository: PostsDbQueryRepository,
                protected commentsService: CommentsService) {
    }

    async getPosts(req: Request, res: Response) {
        // @ts-ignore
        let posts = await this.postQueryRepository.findPosts(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
        res.send(posts);
    }

    async createPost(req: Request, res: Response) {
        const newPostId = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        const newPost = await this.postDbQueryRepository.findPostById(newPostId.toString())
        res.status(201).send(newPost);
    }

    async getPostById(req: Request, res: Response) {
        let post = await this.postDbQueryRepository.findPostById(req.params.id)
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
        let post = await this.postDbQueryRepository.findPostById(req.params.postId)
        if (!post) {
            res.sendStatus(404);
        } else {
            const comment = await this.commentsService.createComment(req.params.postId, req.body.content, req.user!._id, req.user!.userName)
            res.status(201).send(comment)
        }
    }

    async getCommentsForPost(req: Request, res: Response) {
        let post = await this.postDbQueryRepository.findPostById(req.params.postId)
        if (!post) {
            res.sendStatus(404);
        } else {
            const comments = await this.commentsService.getCommentForPost(req.params.postId, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
            if (!comments) {
                res.sendStatus(404)
            } else {
                res.status(200).send(comments)
            }
        }
    }
}