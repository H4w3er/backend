import {BlogsDbRepository} from "../repositories/blogs-db-repository";
import {PostsService} from "./posts-service";
import {PostsDbQueryRepository} from "../repositories/posts-db-query-repository";
import {injectable} from "inversify";

@injectable()
export class BlogsService{
    constructor(protected blogsDbRepository: BlogsDbRepository, protected postsDbQueryRepository: PostsDbQueryRepository, protected postsService: PostsService) {

    }

    async createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return this.blogsDbRepository.createBlog(newBlog)
    }
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return this.blogsDbRepository.updateBlog(id, name, description, websiteUrl)
    }
    async deleteBlog(id: string): Promise<boolean>{
        return this.blogsDbRepository.deleteBlog(id)
    }
    async deleteAll(): Promise<boolean>{
        return this.blogsDbRepository.deleteAll()
    }
    async isBlog(blogId: string): Promise<boolean>{
        return this.blogsDbRepository.isBlog(blogId)
    }
    async createPostForBlog(id: string, title: string, shortDescription: string, content: string){
        const newPostId = await this.postsService.createPost(title, shortDescription, content, id);
        return this.postsDbQueryRepository.findPostById(newPostId.toString())
    }
}