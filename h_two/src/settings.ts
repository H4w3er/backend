import {config} from "dotenv";
config()

export const SETTINGS = {
    PORT: process.env.PORT || 3001,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        AUTH: '/auth',
        SECURITYDEVICES: '/security'
    },
    MONGO_URI: process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || '',
    JWT_SECRET: process.env.JWT_SECRET || "123",
    EMAIL_PASS: process.env.EMAIL_PASS
}