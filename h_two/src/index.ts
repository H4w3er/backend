import express, {Request, Response} from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {SETTINGS} from "./settings";
import {runDb} from "./db/mongo-db";
import {blogsService} from "./domain/blogs-service";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./routers/securityDevices-router";

export const app = express()

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)
app.use(cookieParser())

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITYDEVICES, securityDevicesRouter)

app.get('/', (req, res) => {
    res.status(200).json({version: '2.5'});
})
app.delete('/testing/all-data', async (req, res) => {
    if (await blogsService.deleteAll()) res.sendStatus(204)
})
const startApp = async () =>{
    await runDb()
    app.listen (SETTINGS.PORT, ()=>{
        console.log(`Example listening on port ${SETTINGS.PORT}`)
    })
}
startApp()