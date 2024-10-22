import {Router} from "express";

export const videosRouter = Router({})
const avResolution = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

videosRouter.get('/:id', (req, res) => {
    const foundVideo = db.videos.find((c => c.id === +req.params.id))
    if (!foundVideo) {
        res.sendStatus(404);
        return;
    } else res.json(foundVideo)
})
videosRouter.get('/', (req, res) => {
    if (req.query.title) {
        const foundVideos = db.videos.filter(c => c.title.indexOf(req.query.title as string) > -1)
        res.json(foundVideos)
    } else res.status(200).json(db.videos)
})
videosRouter.post('/', (req, res) => {
    const valids = []
    if (!req.body.title) {
        valids.push({message: "invalid title", field: "title"})
    } else if (req.body.title.length>40) {
        valids.push({message: "invalid title", field: "title"})
    }
    if (!req.body.author) {
        valids.push({message: "invalid author", field: "author"})
    } else if (req.body.author.length>20) {
        valids.push({message: "invalid author", field: "author"})
    }
    if (!(req.body.availableResolutions.every((c: string) => avResolution.includes(c)))){
        valids.push({message: "invalid resolution", field: "availableResolutions"})
    }
    if (valids.length > 0) {
        res.status(400).send({errorsMessages: valids});
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
videosRouter.delete('/:id', (req, res) => {
    if ((db.videos).length === db.videos.filter((c => c.id !== +req.params.id)).length){
        res.sendStatus(404);
        return;
    } else {
        db.videos = db.videos.filter((c => c.id !== +req.params.id));
        res.sendStatus(204);
    }
})
videosRouter.put('/:id', (req, res) => {
    const valid = []
    if (!req.body.title) {
        valid.push({message: "invalid title", field: "title"})
    } else if (req.body.title.length>40) {
        valid.push({message: "invalid title", field: "title"})
    }
    if (!req.body.author) {
        valid.push({message: "invalid author", field: "author"})
    } else if (req.body.author.length>20) {
        valid.push({message: "invalid author", field: "author"})
    }
    if(req.body.canBeDownloaded) {
        if (req.body.canBeDownloaded!==true && req.body.canBeDownloaded!==false){
            valid.push({message: "need to be true or false", field: "canBeDownloaded"})
        }
    }
    if(req.body.minAgeRestriction) {
        if (req.body.minAgeRestriction<1 || req.body.minAgeRestriction>18){
            valid.push({message: "need to be more than 1 and less than 18", field: "minAgeRestriction"})
        }
    }
    if (!(req.body.availableResolutions.every((c: string) => avResolution.includes(c)))){
        valid.push({message: "invalid resolution", field: "availableResolutions"})
    }
    if ((new Date(req.body.publicationDate)).getFullYear() < 2000){
        valid.push({message: "invalid publicationDate", field: "publicationDate"})
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
    updatedVideo.author = req.body.author;
    updatedVideo.canBeDownloaded = req.body.canBeDownloaded;
    updatedVideo.minAgeRestriction = req.body.minAgeRestriction;
    updatedVideo.publicationDate = req.body.publicationDate;
    updatedVideo.availableResolutions = req.body.availableResolutions;

    res.sendStatus(204)
})