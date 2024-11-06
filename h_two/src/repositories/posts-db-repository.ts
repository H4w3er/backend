import {blogCollection, postCollection} from "../db/mongo-db";
import {PostDbType} from "../db/posts-type-db";
import {ObjectId} from "mongodb";

const postMapper = (value: any) => {
    const mappedPost = {
        id: value._id,
        title: value.title,
        shortDescription: value.shortDescription,
        content: value.content,
        blogId: value.blogId,
        blogName: value.blogName,
        createdAt: value.createdAt
    }
    return mappedPost;
}


export const postsRepository = {
    async findPosts(): Promise<PostDbType[]>{
        const arrayOfPosts = await postCollection.find({}).toArray()
        return arrayOfPosts.map(value => postMapper(value))
    },
    async findPostById(id: string): Promise<PostDbType | null>{
        const objId = new ObjectId(id);
        const post = await postCollection.findOne({_id: objId})
        return postMapper(post)
    },
    // @ts-ignore
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostDbType>{
        const objBlogId = new ObjectId(blogId)
        const blog = await blogCollection.findOne({_id: objBlogId})
        if (blog?.name !== undefined){
            const newPost = {
            //id: (+(Date.now())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog?.name.toString(),
            createdAt: new Date().toISOString()
        }
            const newPostId = await postCollection.insertOne(newPost)
            const newPostWithId = await postCollection.findOne({_id: newPostId.insertedId})
            return postMapper(newPostWithId);
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.updateOne({_id: objId}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    },
    async deletePost(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await postCollection.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
}