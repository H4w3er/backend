import {db} from "../db/db";

export const blogsRepository = {
    findBlogs(){
        return db.blogs
    },
    findBlogsById(id: string){
        return db.blogs.find(c => c.id === id)
    },
    createBlog(name: string, description: string, websiteUrl: string){
        const newBlog = {
            id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        db.blogs.push(newBlog)
        return newBlog;
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string){
        let blog = db.blogs.find(c => c.id === id)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.description = description
            return true;
        } else return false;
    },
    deleteBlog(id: string){
        if ((db.blogs).length === db.blogs.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.blogs = db.blogs.filter((c => c.id !== id));
            return true;
        }
    }
}