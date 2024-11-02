import {db} from "../db/db";
import {PostDbType} from "../db/posts-type-db";

export const postsRepository = {
    async findPosts(): Promise<PostDbType[]>{
        return db.posts
    },
    async findPostById(id: string): Promise<PostDbType | undefined>{
        return db.posts.find(c => c.id === id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostDbType>{
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
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        let post = db.posts.find(c => c.id === id)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            return true;
        } else return false;
    },
    async deletePost(id: string): Promise<boolean>{
        if ((db.posts).length === db.posts.filter((c => c.id !== id)).length){
            return false;
        } else {
            db.posts = db.posts.filter((c => c.id !== id));
            return true;
        }
    },
    async isBlog(blogId: string): Promise<boolean>{
        if (db.blogs.find(c => c.id === blogId)){
            return true;
        } else return false
    }
}