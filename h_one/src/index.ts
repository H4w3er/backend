import express, {Request, Response} from 'express'

const app = express()
const port = 3000
let videos = [
    {id: 1, title: 'first', author: 'n1'},
    {id: 2, title: 'sec', author: 'n2'},
    {id: 3, title: 'therd', author: 'n3'}
]

app.get('/videos/:id', (req, res) => {
    const foundVideo = videos.find((c => c.id === +req.params.id))
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    } else res.json(foundVideo)
})
app.get('/videos', (req, res) => {
    if (req.query.title) { const foundVideos = videos
        .filter(c => c.title.indexOf(req.query.title as string) > -1)
        res.json(foundVideos)
    } else res.json(videos)
})
app.post('/videos', (req, res) => {
    const newVideo = {
        id: +(Date.now()),
        title: req.query.title as string,
        author: 'biba'
    }
    videos.push(newVideo)
    res.json(newVideo)
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