import {db} from "../db/db";

export const postsRepository = {
    findPosts(){
        return db.posts
    },
    findPostById(id: string){
        return db.blogs.find(c => c.id === id)
    },
    createPost(name: string, description: string, websiteUrl: string){
        const newBlog = {
            id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        db.blogs.push(newBlog)
        return newBlog;
    },
    updatePost(id: string, name: string, description: string, websiteUrl: string){
        let blog = db.blogs.find(c => c.id === id)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.description = description
            return true;
        } else return false;
    },
    deletePost(id: string){
        if ((db.blogs).length === db.blogs.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.blogs = db.blogs.filter((c => c.id !== id));
            return true;
        }
    },
}