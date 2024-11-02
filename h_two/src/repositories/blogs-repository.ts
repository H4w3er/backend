import {db} from "../db/db";
import {BlogDbType} from "../db/blogs-type-db";

export const blogsRepository = {
    async findBlogs(): Promise<BlogDbType[]>{
        return db.blogs
    },
    async findBlogsById(id: string): Promise<BlogDbType | undefined>{
        return db.blogs.find(c => c.id === id)
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogDbType>{
        const newBlog = {
            id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        db.blogs.push(newBlog)
        return newBlog;
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise <boolean>{
        let blog = db.blogs.find(c => c.id === id)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.description = description
            return true;
        } else return false;
    },
    async deleteBlog(id: string): Promise<boolean>{
        if ((db.blogs).length === db.blogs.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.blogs = db.blogs.filter((c => c.id !== id));
            return true;
        }
    },
    async deleteAll(): Promise<boolean>{
        db.blogs = []
        db.posts = []
        return true;
    }
}