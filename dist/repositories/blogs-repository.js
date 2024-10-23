"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
exports.blogsRepository = {
    findBlogs() {
        return db_1.db.blogs;
    },
    findBlogsById(id) {
        return db_1.db.blogs.find(c => c.id === id);
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: (+(Date.now())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id, name, description, websiteUrl) {
        let blog = db_1.db.blogs.find(c => c.id === id);
        if (blog) {
            blog.name = name;
            blog.description = description;
            blog.description = description;
            return true;
        }
        else
            return false;
    },
    deleteBlog(id) {
        if ((db_1.db.blogs).length === db_1.db.blogs.filter((c => c.id !== id)).length) {
            return false;
        }
        else {
            db_1.db.blogs = db_1.db.blogs.filter((c => c.id !== id));
            return true;
        }
    }
};
