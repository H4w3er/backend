import {db} from "../db/db";

export const postsRepository = {
    findPosts(){
        return db.posts
    },
    findPostById(id: string){
        return db.posts.find(c => c.id === id)
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string){
        const newPost = {
            id: (+(Date.now())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: db.blogs.find(c => c.id === blogId).name
        }
        db.posts.push(newPost)
        return newPost;
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
    /*deletePost(id: string){
        if ((db.blogs).length === db.blogs.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.blogs = db.blogs.filter((c => c.id !== id));
            return true;
        }
    },*/
}