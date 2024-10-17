import express, {Request, Response} from 'express'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

const db = {
    videos: [
        {id: 1, title: 'first', author: 'n1'},
        {id: 2, title: 'sec', author: 'n2'},
        {id: 3, title: 'therd', author: 'n3'}
    ]
}

app.get('/videos/:id', (req, res) => {
    const foundVideo = db.videos.find((c => c.id === +req.params.id))
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    } else res.json(foundVideo)
})
app.get('/videos', (req, res) => {
    if (req.query.title) { const foundVideos = db.videos
        .filter(c => c.title.indexOf(req.query.title as string) > -1)
        res.json(foundVideos)
    } else res.json(db.videos)
})
app.post('/videos', (req, res) => {
    if (!req.body.title){
        res.sendStatus(400);
        return;
    }
    const newVideo = {
        id: +(Date.now()),
        title: req.body.title,
        author: 'kniga'
    }
    db.videos.push(newVideo)
    res.status(201).json(newVideo)
})
app.delete('/videos/:id', (req, res) => {
    if ((db.videos).length === db.videos.filter((c => c.id !== +req.params.id)).length){
        res.sendStatus(404);
        return;
    } else {
        db.videos = db.videos.filter((c => c.id !== +req.params.id));
        res.sendStatus(204);
    }
})
app.put('/videos/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400)
        return;
    }
    const updatedVideo = db.videos.find((c => c.id === +req.params.id))
    if (!updatedVideo) {
        res.sendStatus(404);
        return;
    } else updatedVideo.title = req.body.title;
    res.status(204)
})

app.listen (port, ()=>{
    console.log(`Example listening on port ${port}`)
})


/*export const video1: any /!*VideoDBType*!/ = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    // author: 'a' + Date.now() + Math.random(),
    // canBeDownloaded: true,
    // minAgeRestriction: null,
    // createdAt: new Date().toISOString(),
    // publicationDate: new Date().toISOString(),
    // availableResolution: [Resolutions.P240],
}*/