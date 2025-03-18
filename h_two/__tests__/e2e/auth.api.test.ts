import request from 'supertest'
import {app} from "../../src";

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
        expect(response.status).toBe(200)
        expect(response.body.accessToken).toMatch(/^([A-Za-z0-9_-]+).([A-Za-z0-9_-]+).([A-Za-z0-9_-]+)$/)
    });

    /*it('should return invalid message for incorrect token', async () => {
        const response = await request(app)
            .get('/check-token')
            .set('Cookie', 'token=invalid_token');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token is invalid');
    });*/
});