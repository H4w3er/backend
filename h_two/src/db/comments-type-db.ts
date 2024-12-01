import {ObjectId} from "mongodb";

export type CommentsDbType = {
    "_id": ObjectId,
    "content": string,
    "commentatorInfo": {
        "userId": string,
        "userLogin": string
    },
    "createdAt": string,
    "postId": ObjectId
}