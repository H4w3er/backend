import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postsService} from "../domain/posts-service";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validation";
import {postQueryRepository} from "../repositories/posts-db-query-repository";
import {commentsService} from "../domain/comments-service";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {contentCommentValidation, postIdCommentValidation} from "../middlewares/comments-validation";

export const postsRouter = Router({})

postsRouter.get('/', async(req, res) => {
    // @ts-ignore
    let posts = await postQueryRepository.findPosts(req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
    res.send(posts);
})

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req, res) => {
    const newPostId = await postsService.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)
        const newPost = await postQueryRepository.findPostById(newPostId.toString())
        console.log(newPost)
        res.status(201).send(newPost);
    })

postsRouter.get('/:id', async (req, res) => {
    let post = await postQueryRepository.findPostById(req.params.id)
    if (post){
        res.status(200).send(post)
    } else res.sendStatus(404);
})

postsRouter.put('/:id',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req, res) => {
    if(await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId)) {
        res.sendStatus(204)
    } else res.sendStatus(404)
    })

postsRouter.delete('/:id', authMiddleware,
    async (req, res) => {
    if (await postsService.deletePost(req.params.id)){
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    contentCommentValidation,
    //postIdCommentValidation,
    inputValidationMiddleware,
    async (req,res) => {
    if (req.params.postId.length!==24) {
        res.sendStatus(404)
    } else {
        let post = await postQueryRepository.findPostById(req.params.postId)
        if (!post) {
            res.sendStatus(404);
        } else {
            const comment = await commentsService.createComment(req.params.postId, req.body.content, req.user!._id, req.user!.userName)
            res.status(201).send(comment)
        }
    }
    })

postsRouter.get('/:postId/comments',
    async (req, res) => {
        let post = await postQueryRepository.findPostById(req.params.postId)
        if (!post){
            res.sendStatus(404);
        }
        const comments = await commentsService.getCommentForPost(req.params.postId, req.query.sortBy, req.query.sortDirection, req.query.pageNumber, req.query.pageSize)
        if (!comments) res.sendStatus(404)
        res.status(200).send(comments)
})
