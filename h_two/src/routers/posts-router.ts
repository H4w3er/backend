import {Router} from "express";
import {db} from "../db/db";

export const postsRouter = Router({})


postsRouter.get('/', (req, res) => {
    res.status(200).send(db.posts);
})
postsRouter.post('/', (req, res) => {

})
postsRouter.get('/:id', (req, res) => {

})
postsRouter.put('/:id', (req, res) => {

})
postsRouter.delete('/:id', (req, res) => {

})

