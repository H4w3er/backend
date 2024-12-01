import {commentsCollection} from "../db/mongo-db";
import {CommentsDbType} from "../db/comments-type-db";
import {ObjectId} from "mongodb";

const commentMapper = (comment: CommentsDbType | null)=> {
    if (comment) {
        return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    }
    return null;
}

const commentFilterForPost = async (postId: string, sortBy: string = "createdAt", sortDirection: any = 'desc', pageNumber:number=1, pageSize:number=10) => {
    try {
        const items = await commentsCollection
            .find({postId: new ObjectId(postId)})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(Number(pageSize))
            .toArray() as any[]
        const totalCount = await commentsCollection.countDocuments({postId: new ObjectId(postId)})

        // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: totalCount,
            items: items.map(value => commentMapper(value))
        }
    } catch (e) {
        console.log(e)
        return {error: 'some error'}
    }
}

export const commentsRepository = {
    async createComment(comment: any){
        const idOfComment = await commentsCollection.insertOne(comment);
        return commentMapper(await commentsCollection.findOne({_id:idOfComment.insertedId}))
    },
    async getCommentById(commentId: string){
        const objId = new ObjectId(commentId)
        const comment = await commentsCollection.findOne({_id: objId})
        return commentMapper(comment)
    },
    async getCommentForPost(postId: string, sortBy: any, sortDirection: any, pageNumber:number, pageSize:number){
        return commentFilterForPost(postId, sortBy, sortDirection, pageNumber, pageSize)
    },
    async updateCommentById(commentId: string, newContent: string){
        const newComment = await commentsCollection.updateOne({_id: new ObjectId(commentId)}, {$set: {content: newContent}})
        return newComment
    }
}