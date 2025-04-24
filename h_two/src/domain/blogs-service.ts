import {blogsDbRepository} from "../repositories/blogs-db-repository";
import {postsService} from "./posts-service";
import {postQueryRepository} from "../repositories/posts-db-query-repository";

class BlogsService{
    async createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return blogsDbRepository.createBlog(newBlog)
    }
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return blogsDbRepository.updateBlog(id, name, description, websiteUrl)
    }
    async deleteBlog(id: string): Promise<boolean>{
        return blogsDbRepository.deleteBlog(id)
    }
    async deleteAll(): Promise<boolean>{
        return blogsDbRepository.deleteAll()
    }
    async isBlog(blogId: string): Promise<boolean>{
        return blogsDbRepository.isBlog(blogId)
    }
    async createPostForBlog(id: string, title: string, shortDescription: string, content: string){
        const newPostId = await postsService.createPost(title, shortDescription, content, id);
        return postQueryRepository.findPostById(newPostId.toString())
    }
}

export const blogsService = new BlogsService