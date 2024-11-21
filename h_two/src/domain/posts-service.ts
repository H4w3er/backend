import {postsRepository} from "../repositories/posts-db-repository";
import {blogQueryRepository} from "../repositories/blogs-db-query-repository";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const newPost ={
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: (await blogQueryRepository.getBlogName(blogId)),
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}