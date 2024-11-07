import {postsRepository} from "../repositories/posts-db-repository";


export const postsService = {
    async findPosts() {
        return postsRepository.findPosts()
    },
    async findPostById(id: string) {
        return postsRepository.findPostById(id)
    },
    // @ts-ignore
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        return postsRepository.createPost(title, shortDescription, content, blogId)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}