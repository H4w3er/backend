import {PostsDbRepository} from "../repositories/posts-db-repository";
import {BlogsDbQueryRepository} from "../repositories/blogs-db-query-repository";


export class PostsService {
    postsDbRepository: PostsDbRepository
    blogsDbQueryRepository: BlogsDbQueryRepository
    constructor() {
        this.postsDbRepository = new PostsDbRepository()
        this.blogsDbQueryRepository = new BlogsDbQueryRepository()
    }
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const newPost ={
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: (await this.blogsDbQueryRepository.getBlogName(blogId)),
            createdAt: new Date().toISOString()
        }
        return this.postsDbRepository.createPost(newPost)
    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsDbRepository.updatePost(id, title, shortDescription, content, blogId)
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsDbRepository.deletePost(id)
    }

}