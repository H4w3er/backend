import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {LikerPostInfoModel, PostDbTypeModel} from "../db/posts-type-db";

@injectable()
export class PostsDbRepository {
    async createPost(post: any){
        await post.save()
        await LikerPostInfoModel.create({likerId: post.userId.toString(), status: 'None', postId: post._id.toString()})
        return post._id;
    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await PostDbTypeModel.updateOne({_id: objId}, {$set:{title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1;
    }
    async deletePost(id: string): Promise<boolean>{
        const objId = new ObjectId(id);
        const result = await PostDbTypeModel.deleteOne({_id: objId})
        return result.deletedCount === 1;
    }
    async updateLikeStatus(newLikeStatus: string, userId: string, postId: string, oldStatus: string){
        const postIdObj = new ObjectId(postId)
        await LikerPostInfoModel.updateOne({likerId: userId, postId: postId}, {$set: {status: newLikeStatus}})
        if (newLikeStatus === 'None' && oldStatus === 'Like') await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: { "extendedLikesInfo.likesCount": -1}})
        if (newLikeStatus === 'None' && oldStatus === 'Dislike') await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: { "extendedLikesInfo.dislikesCount": -1}})
        if (newLikeStatus === 'Like' && oldStatus === 'Dislike') {
            await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: { "extendedLikesInfo.likesCount": 1}})
            await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: {"extendedLikesInfo.dislikesCount": -1}})
        }
        if (newLikeStatus === 'Like' && oldStatus === 'None') await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: { "extendedLikesInfo.likesCount": 1}})
        if (newLikeStatus === 'Dislike' && oldStatus === 'None') await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: { "extendedLikesInfo.dislikesCount": 1}})
        if (newLikeStatus === 'Dislike' && oldStatus === 'Like'){
            await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: {"extendedLikesInfo.likesCount": -1}})
            await PostDbTypeModel.updateOne({_id: postIdObj}, {$inc: {"extendedLikesInfo.dislikesCount": +1}})
        }
    }
}