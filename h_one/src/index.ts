import express, {Request, Response} from 'express'
import {videosRouter} from "./routers/videos-router";

const app = express()
const port = process.env.PORT || 3003;
const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware)
app.use('/videos', videosRouter)

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})
videosRouter.delete('/testing/all-data', (req, res) => {
    db.videos = [];
    res.sendStatus(204)
})

app.listen (port, ()=>{
    console.log(`Example listening on port ${port}`)
})
