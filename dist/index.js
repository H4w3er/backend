"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routers/blogs-router");
const posts_router_1 = require("./routers/posts-router");
//import bodyParser from 'body-parser'
const app = (0, express_1.default)();
const port = process.env.PORT || 3003;
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
//app.use(bodyParser())
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/posts', posts_router_1.postsRouter);
app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
app.listen(port, () => {
    console.log(`Example listening on port ${port}`);
});
