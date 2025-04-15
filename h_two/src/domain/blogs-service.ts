import {blogsRepository} from "../repositories/blogs-db-repository";
import {postsService} from "./posts-service";
import {postQueryRepository} from "../repositories/posts-db-query-repository";


export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return blogsRepository.createBlog(newBlog)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return blogsRepository.updateBlog(id, name, description, websiteUrl)
    },
    async deleteBlog(id: string): Promise<boolean>{
        return blogsRepository.deleteBlog(id)
    },
    async deleteAll(): Promise<boolean>{
        return blogsRepository.deleteAll()
    },
    async isBlog(blogId: string): Promise<boolean>{
        return blogsRepository.isBlog(blogId)
    },
    async createPostForBlog(id: string, title: string, shortDescription: string, content: string){
        const newPostId = await postsService.createPost(title, shortDescription, content, id);
        return postQueryRepository.findPostById(newPostId.toString())
    }
}