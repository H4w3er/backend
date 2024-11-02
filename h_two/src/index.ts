import express, {Request, Response} from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {blogsRepository} from "./repositories/blogs-repository";
import {SETTINGS} from "./settings";

const app = express()

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})
app.delete('/testing/all-data', async (req, res) => {
    if (await blogsRepository.deleteAll()) res.sendStatus(204)
})

app.listen (SETTINGS.PORT, ()=>{
    console.log(`Example listening on port ${SETTINGS.PORT}`)
})