import request from "supertest";
import {app} from "../../src";

describe('Likes to posts tests', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    describe('likes to posts', () => {
        it('should create two new users', async () => {
            const authorizationToken = 'Basic admin:qwerty'
            const firstUser = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "firstUser",
                    "email": "email1221artem@mail.com",
                    "password": "string"
                })
            const secondUser = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "secUser",
                    "email": "superEmail@mail.com",
                    "password": "string"
                })
            const thirdUser = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "thirdUser",
                    "email": "supEmail@mail.com",
                    "password": "string"
                })
            const fourthUser = await request(app)
                .post('/users')
                .set('Authorization', authorizationToken)
                .send({
                    "login": "fourUser",
                    "email": "erEmail@mail.com",
                    "password": "string"
                })
            expect(firstUser.status).toBe(201)
            expect(secondUser.status).toBe(201)
            expect(thirdUser.status).toBe(201)
            expect(fourthUser.status).toBe(201)
        })

        it('should login two users, create blog and posts than likes', async () => {
            const firstUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "firstUser",
                    "password": "string"
                })
            const secondUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "secUser",
                    "password": "string"
                })
            const thirdUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "thirdUser",
                    "password": "string"
                })
            const fourthUserLogin = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "fourUser",
                    "password": "string"
                })
            expect(firstUserLogin.status).toBe(200)
            expect(secondUserLogin.status).toBe(200)
            expect(thirdUserLogin.status).toBe(200)
            expect(fourthUserLogin.status).toBe(200)

            const authorizationToken = 'Basic admin:qwerty'
            const mainBlogCreation = await request(app)
                .post('/blogs')
                .set('Authorization', authorizationToken)
                .send({
                    "name": "first",
                    "description": "blog",
                    "websiteUrl": "https://wuj5_R1TaqiUYYdzeDMXtdS7Qm_ga-bppGIlWSzfOuY9lJO20Nh33OuFCEWnDw5U4O2_3jEfqDFZSKkX4HfD7Eo.v0xQ"
                })
            const firstPostCreation = await request(app)
                .post('/posts')
                .set('Authorization', authorizationToken)
                .send({
                    "title": "first",
                    "shortDescription": "my first post to this blog",
                    "content": "there is no content bro",
                    "blogId": mainBlogCreation.body.id
                })
            expect(mainBlogCreation.status).toBe(201)
            expect(firstPostCreation.status).toBe(201)

            const accessTokenFirst = firstUserLogin.body.accessToken
            const accessTokenSecond = secondUserLogin.body.accessToken
            const accessTokenThird = thirdUserLogin.body.accessToken
            const accessTokenFourth = fourthUserLogin.body.accessToken

            const likePostByFirstUser = await request(app)
                .put(`/posts/${firstPostCreation.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenFirst)
                .send({
                    "likeStatus": "Like"
                })
            expect(likePostByFirstUser.status).toBe(204)
            const getAllPostsByFirstUser = await request(app)
                .get('/posts')
                .set('Authorization', 'Bearer ' + accessTokenFirst)
            console.log(getAllPostsByFirstUser.body.items[0].extendedLikesInfo)
            const likePostBySecUser = await request(app)
                .put(`/posts/${firstPostCreation.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
                .send({
                    "likeStatus": "Like"
                })
            expect(likePostBySecUser.status).toBe(204)
            const getAllPostsByThirdtUser = await request(app)
                .get('/posts')
                .set('Authorization', 'Bearer ' + accessTokenThird)
            console.log(getAllPostsByThirdtUser.body.items[0].extendedLikesInfo)
            /*const likePostByThirdtUser = await request(app)
                .put(`/posts/${firstPostCreation.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenThird)
                .send({
                    "likeStatus": "Like"
                })
            expect(likePostByFirstUser.status).toBe(204)

            const likePostByFourthUser = await request(app)
                .put(`/posts/${firstPostCreation.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenFourth)
                .send({
                    "likeStatus": "Like"
                })
            expect(likePostBySecUser.status).toBe(204)

            const getAllPostsByFirstUser = await request(app)
                .get('/posts')
                .set('Authorization', 'Bearer ' + accessTokenFirst)

            expect(getAllPostsByFirstUser.body.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
            //console.log(getAllPostsByFirstUser.body.items[0].extendedLikesInfo)

            const dislikePostByThirdUser = await request(app)
                .put(`/posts/${firstPostCreation.body.id}/like-status`)
                .set('Authorization', 'Bearer ' + accessTokenThird)
                .send({
                    "likeStatus": "Dislike"
                })
            expect(dislikePostByThirdUser.status).toBe(204)

            const getAllPostsByThirdUser = await request(app)
                .get('/posts')
                .set('Authorization', 'Bearer ' + accessTokenThird)

            expect(getAllPostsByThirdUser.body.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
            expect(getAllPostsByThirdUser.body.items[0].extendedLikesInfo.myStatus).toBe('Dislike')
            //console.log(getAllPostsByThirdUser.body.items[0].extendedLikesInfo)

            const getPostByIdBySecUser = await request(app)
                .get(`/posts/${firstPostCreation.body.id}`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
            console.log(getPostByIdBySecUser.body.extendedLikesInfo)
*/
            /*const getPostByIdBySecUser = await request(app)
                .get(`/posts/${firstPostCreation.body.id}`)
                .set('Authorization', 'Bearer ' + accessTokenSecond)
            console.log(getPostByIdBySecUser.body.extendedLikesInfo)

            const getAllPostsBySecUser = await request(app)
                .get('/posts')
                .set('Authorization', 'Bearer ' + accessTokenSecond)
            console.log(getAllPostsBySecUser.body.items[0].extendedLikesInfo)*/
        })
    })
})