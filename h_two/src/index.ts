import express, {Request, Response} from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {SETTINGS} from "./settings";
import {runDb} from "./db/mongo-db";
import {blogsService} from "./domain/blogs-service";

const app = express()

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)

app.get('/', (req, res) => {
    res.status(200).json({version: '2.0'});
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