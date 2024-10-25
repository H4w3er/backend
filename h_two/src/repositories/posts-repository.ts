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
            // @ts-ignore
            blogName: db.blogs.find(c => c.id === blogId).name
        }
        db.posts.push(newPost)
        return newPost;
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string){
        let post = db.posts.find(c => c.id === id)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            return true;
        } else return false;
    },
    deletePost(id: string){
        if ((db.posts).length === db.posts.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.posts = db.posts.filter((c => c.id !== id));
            return true;
        }
    },
    isBlog(blogId: string){
        if (db.blogs.find(c => c.id === blogId)){
            return true;
        } else return false
    }
}