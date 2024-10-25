import {BlogDbType} from "./blogs-type-db";
import {PostDbType} from "./posts-type-db";

export type DBType = {
    blogs: BlogDbType[],
    posts: PostDbType[]
}

export const db: DBType = {
    blogs: [],
    posts: []
}