import express, {Request, Response} from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {blogsRepository} from "./repositories/blogs-repository";
//import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})
app.delete('/testing/all-data', (req, res) => {
    if (blogsRepository.deleteAll()) res.sendStatus(204)
})

app.listen (port, ()=>{
    console.log(`Example listening on port ${port}`)
})