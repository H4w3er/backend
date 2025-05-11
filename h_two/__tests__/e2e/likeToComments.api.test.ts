import request from "supertest";
import {app} from "../../src";

describe('Likes tests', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    describe('users, blog and post creation', () => {
        it('should create two new users', async () => {
            const authorizationToken = 'Basic admin:qwerty'
            const firstUserCreation = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "first User",
                    "email": "email1221artem@mail.com",
                    "password": "string"
                })
            const secondUserCreation = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "secUser",
                    "email": "superEmail@mail.com",
                    "password": "string"
                })
            expect(firstUserCreation.status).toBe(201)
            expect(secondUserCreation.status).toBe(201)
        })
        jest.setTimeout(10000);
        it('should create new blog and post to this blog, than auth two users and create comments', async () => {
            const authorizationToken = 'Basic admin:qwerty'
            const blogCreation = await request(app)
                .post('/blogs')
                .set('Authorization', authorizationToken)
                .send({
                    "name": "first",
                    "description": "blog",
                    "websiteUrl": "https://wuj5_R1TaqiUYYdzeDMXtdS7Qm_ga-bppGIlWSzfOuY9lJO20Nh33OuFCEWnDw5U4O2_3jEfqDFZSKkX4HfD7Eo.v0xQ"
                })
            const postCreation = await request(app)
                .post('/posts')
                .set('Authorization', authorizationToken)
                .send({
                    "title": "first",
                    "shortDescription": "my first post to this blog",
                    "content": "there is no content bro",
                    "blogId": blogCreation.body.id
                })
            expect(blogCreation.status).toBe(201)
            expect(postCreation.status).toBe(201)
            const firstUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "first User",
                    "password": "string"
                })
            const secondUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "secUser",
                    "password": "string"
                })
            expect(firstUserLogin.status).toBe(200)
            expect(secondUserLogin.status).toBe(200)

            const accessTokenFirst = firstUserLogin.body.accessToken
            const accessTokenSecond = secondUserLogin.body.accessToken
            const firstComment = await request(app)
                .post(`/posts/${postCreation.body.id}/comments`)
                .set('Authorization', 'Bearer ' + accessTokenFirst)
                .send({
                    "content":"first comment for first post"
                })
            expect(firstComment.status).toBe(201)

            const secondComment = await request(app)
                .post(`/posts/${postCreation.body.id}/comments`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
                .send({
                    "content":"first comment for first post"
                })
            expect(secondComment.status).toBe(201)

            const likeFirstComment = await request(app)
                .put(`/comments/${firstComment.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenFirst)
                .send({
                    "likeStatus": "Like"
                })
            expect(likeFirstComment.status).toBe(204)
            const likeSecondComment = await request(app)
                .put(`/comments/${secondComment.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
                .send({
                    "likeStatus": "Like"
                })
            expect(likeFirstComment.status).toBe(204)

            const updatedComment = await request(app)
                .get(`/comments/${firstComment.body.id}`)
                .set('Authorization', 'Bearer ' + accessTokenFirst)
            expect(updatedComment.body.likesInfo.myStatus).toBe('Like')
            //console.log(updatedComment.body)

            const likeCommentSecond = await request(app)
                .put(`/comments/${secondComment.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
                .send({
                    "likeStatus": "Like"
                })
            expect(likeFirstComment.status).toBe(204)

            const updatedCommentForSecUser = await request(app)
                .get(`/comments/${firstComment.body.id}`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
            //console.log(updatedCommentForSecUser.body)
            expect(updatedCommentForSecUser.body.likesInfo.myStatus).toBe('None')

            const allCommentsForNoOne = await request(app)
                .get(`/posts/${postCreation.body.id}/comments`)
            console.log(allCommentsForNoOne.body.items[0])
        })
    })
})