import {PostsDbRepository} from "../repositories/posts-db-repository";
import {BlogsDbQueryRepository} from "../repositories/blogs-db-query-repository";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {PostDbTypeModel} from "../db/posts-type-db";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";
import {JwtService} from "../application/jwt-service";

@injectable()
export class PostsService {
    constructor(protected postsDbRepository: PostsDbRepository,
                protected blogsDbQueryRepository: BlogsDbQueryRepository,
                protected postsDbQueryRepository: PostsDbQueryRepository,
                protected jwtService: JwtService) {}

    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const newPost = new PostDbTypeModel({
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: (await this.blogsDbQueryRepository.getBlogName(blogId)),
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                /*newestLikes: [
                    {
                        addedAt: "-",
                        userId: "-",
                        login: "-"
                    }
                ]*/
            }
        })
        return this.postsDbRepository.createPost(newPost)
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsDbRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsDbRepository.deletePost(id)
    }
    async updatedLikeStatus(newLikeStatus: string, userId: string, postId: string, userLogin: string){
        const post = await this.postsDbQueryRepository.findPostById(postId, userId)
        if (!post) return 'not found'
        const oldStatus = await this.postsDbQueryRepository.getLikeStatus(userId, postId)
        if (!oldStatus) return 'not found'
        if (oldStatus.status === newLikeStatus) return 'updated'
        await this.postsDbRepository.updateLikeStatus(newLikeStatus, userId, postId, oldStatus.status, userLogin)
        return 'updated'
    }
}