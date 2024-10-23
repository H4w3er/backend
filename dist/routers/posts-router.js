"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    res.status(200).send(db_1.db.posts);
});
exports.postsRouter.post('/', (req, res) => {
});
exports.postsRouter.get('/:id', (req, res) => {
});
exports.postsRouter.put('/:id', (req, res) => {
});
exports.postsRouter.delete('/:id', (req, res) => {
});
