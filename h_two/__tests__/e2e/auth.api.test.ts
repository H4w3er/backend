import request from 'supertest'
import {app} from "../../src";
import {header} from "express-validator";
import {response} from "express";

describe('Token validation', () => {
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })
    afterAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })

    it('should create new user', async () => {
        const response = await request(app)
            .post('/auth/registration')
            .send({
                "login": "asdasd",
                "password": "string",
                "email": "testbox2000@list.ru"
            })
        expect(response.status).toBe(204)
    });
    it('should login user and send jwt and refresh token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string"
            })
        const refreshTokenCookie = response.headers['set-cookie'];
        expect(refreshTokenCookie).toBeDefined()

        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.accessToken).toMatch(/^([A-Za-z0-9_-]+).([A-Za-z0-9_-]+).([A-Za-z0-9_-]+)$/)
    });

    it('should return new \'refresh\' and \'access\' tokens; status 200; ' +
        'content: new JWT \'access\' token, new JWT \'refresh\' token in cookie (http only, secure)', async () => {
        const responseRefreshToken = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string"
            })
        const refreshToken = responseRefreshToken.headers['set-cookie']
        const response = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', refreshToken);

        const refreshTokenCookie = response.headers['set-cookie'];
        expect(refreshTokenCookie).toBeDefined()
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toMatch(/^([A-Za-z0-9_-]+).([A-Za-z0-9_-]+).([A-Za-z0-9_-]+)$/);
    });
    jest.setTimeout(30000);
    it('should return an error if the "refresh" token has become invalid; status 401', async () => {
        const responseRefreshToken = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string"
            })
        await new Promise((r) => setTimeout(r, 20000));
        const refreshToken = responseRefreshToken.headers['set-cookie']
        const response = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', refreshToken);
        expect(response.status).toBe(401)
    });
    /*it('should read from headers ip address of user', async()=>{
        const responseAfterLogin = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string"
            })
            .set('Cookie', ['x-forwarded-for=192.168.0.1']);
        expect(response.status).toBe(200)
    })*/
});