import express, {Request, Response} from 'express'
import any = jasmine.any;

const app = express()
const port = process.env.PORT || 3003;
const avResolution = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: any[]
}
const db: DBType = {
    videos: [{
        "id": 1729447865592,
        "title": "aasda",
        "author": "some author",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": "2024-10-19T18:11:05.592Z",
        "publicationDate": "2024-10-20T18:11:05.593Z",
        "availableResolutions": [
            "P240"
        ]
    }]
}

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})
app.get('/videos/:id', (req, res) => {
    const foundVideo = db.videos.find((c => c.id === +req.params.id))
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    } else res.json(foundVideo)
})
app.get('/videos', (req, res) => {
    if (req.query.title) {
        const foundVideos = db.videos.filter(c => c.title.indexOf(req.query.title as string) > -1)
        res.json(foundVideos)
    } else res.status(200).json(db.videos)
})
app.post('/videos', (req, res) => {
    if (!req.body.title){
        res.status(400).send({errorsMessages: [{message: "invalid title", field: "title"}]})
        return;
    } else if (!req.body.author){
        res.sendStatus(400);
        return;
    } else if (!req.body.availableResolutions) {
        res.sendStatus(400);
        return;
    } else if (!(avResolution.includes(req.body.availableResolutions.toString()))){
        res.sendStatus(400);
        return;
    }
    const newVideo = {
        id: +(Date.now()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: req.body.availableResolutions
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
app.delete('/testing/all-data', (req, res) => {
    db.videos = [];
    res.sendStatus(204)
})
app.put('/videos/:id', (req, res) => {
    const valid = []
    if (!req.body.title) {
        valid.push({message: "invalid title", field: "title"})
    }
    if(req.body.canBeDownloaded) {
        if (req.body.canBeDownloaded!==true && req.body.canBeDownloaded!==false){
            valid.push({message: "need to be true or false", field: "canBeDownloaded"})
        }
    }
    if (valid.length > 0) {
        res.status(400).send({errorsMessages: valid});
        return;
    }
    const updatedVideo = db.videos.find(c => c.id === +req.params.id);
    if (!updatedVideo) {
        res.sendStatus(404);
        return;
    }
    updatedVideo.title = req.body.title;
    res.sendStatus(204)
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