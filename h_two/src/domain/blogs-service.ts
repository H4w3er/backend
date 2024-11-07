import {blogsRepository} from "../repositories/blogs-db-repository";


export const blogsService = {
    async findBlogs(id: any, searchNameTerm:any, sortBy: any, sortDirection: any, pageNumber: any, pageSize: any){
        return blogsRepository.findBlogs(id, searchNameTerm, sortBy, sortDirection, pageNumber, pageSize);
    },
    async findBlogsById(id: string){
        return blogsRepository.findBlogsById(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            //id: (+(Date.now())).toString(),
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
    }
}