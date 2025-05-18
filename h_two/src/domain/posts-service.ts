import {PostsDbRepository} from "../repositories/posts-db-repository";
import {BlogsDbQueryRepository} from "../repositories/blogs-db-query-repository";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {PostDbTypeModel} from "../db/posts-type-db";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";

@injectable()
export class PostsService {
    constructor(protected postsDbRepository: PostsDbRepository,
                protected blogsDbQueryRepository: BlogsDbQueryRepository,
                protected postsDbQueryRepository: PostsDbQueryRepository) {}

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
                newestLikes: [
                    {
                        addedAt: "-",
                        userId: "-",
                        login: "-"
                    }
                ]
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
    async updatedLikeStatus(likeStatus: string, userId: string, postId: string){
        const post = await this.postsDbQueryRepository.findPostById(userId)
        if (!post) return 'not found'
        const oldStatus = await this.postsDbQueryRepository.getLikeStatus(userId, postId)
        if (!oldStatus) return 'not found'
        return 
    }
}