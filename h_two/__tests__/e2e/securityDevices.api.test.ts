import request from "supertest";
import {app} from "../../src";
import {JwtService} from "../../src/application/jwt-service";

describe('Security devices tests', () => {
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
        const jwtService = new JwtService()
    })

    it('should create two users', async () => {
        const authorizationToken = 'Basic admin:qwerty'
        const firstUser = await request(app)
            .post('/users')
            .set('Authorization', authorizationToken)
            .send({
                "login": "asdasd",
                "password": "string1",
                "email": "somemail1@list.ru"
            })
        const secondUser = await request(app)
            .post('/users')
            .set('Authorization', authorizationToken)
            .send({
                "login": "ababab",
                "password": "string2",
                "email": "somemail2@list.ru"
            })
        expect(firstUser.status).toBe(201)
        expect(secondUser.status).toBe(201)
        expect(firstUser.body).toStrictEqual(expect.objectContaining({ login: 'asdasd' }));
        expect(secondUser.body).toStrictEqual(expect.objectContaining({ login: 'ababab' }));
    });

    it('should login two users with different deviceId', async () => {
        const firstUser = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string1"
            })
        const secondUser = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "ababab",
                "password": "string2"
            })

        const refreshTokenCookieFirst = firstUser.headers['set-cookie'][0].slice(0, 12);
        const refreshTokenCookieSecond = secondUser.headers['set-cookie'][0].slice(0, 12);
        expect(refreshTokenCookieFirst).toBe('refreshToken')
        expect(refreshTokenCookieSecond).toBe('refreshToken')

        expect(firstUser.status).toBe(200)
        expect(secondUser.status).toBe(200)

        expect(firstUser.body.accessToken).toBeDefined()
        expect(firstUser.body.accessToken).toBeDefined()
        expect(secondUser.body.accessToken).toMatch(/^([A-Za-z0-9_-]+).([A-Za-z0-9_-]+).([A-Za-z0-9_-]+)$/)
        expect(secondUser.body.accessToken).toMatch(/^([A-Za-z0-9_-]+).([A-Za-z0-9_-]+).([A-Za-z0-9_-]+)$/)

        const deviceIdCookieFirst = firstUser.headers['set-cookie'][1];
        const deviceIdCookieSecond = secondUser.headers['set-cookie'][1];
        expect(deviceIdCookieFirst.slice(0,8)).toBe('deviceId')
        expect(deviceIdCookieSecond.slice(0,8)).toBe('deviceId')
    });

    it('should return active sessions for user', async () => {
        const firstUser = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string1"
            })
            .set('user-agent', 'Chrome123')
            .set('x-forwarded-for', '165.95.1.0')
        const responseSessions = await request(app)
            .get('/security/devices')
            .set('Cookie', firstUser.headers['set-cookie'][0])

        // console.log(responseSessions.body[1])
        // console.log(firstUser.headers['set-cookie'][1])
        // console.log(await jwtService.getDeviceIdByToken(firstUser.headers['set-cookie'][0].slice(13, 240)))

        expect(responseSessions.body.length).toBe(2)
        expect(responseSessions.body[1].deviceId).toContain(firstUser.headers['set-cookie'][1].slice(16, 40).toString())
    });

    it('should delete all other sessions', async () => {
        const authorizationToken = 'Basic admin:qwerty'
        const firstUserCreation = await request(app)
            .post('/users')
            .set('Authorization', authorizationToken)
            .send({
                "login": "asdasd",
                "password": "string1",
                "email": "somemail1@list.ru"
            })
        const secondUserCreation = await request(app)
            .post('/users')
            .set('Authorization', authorizationToken)
            .send({
                "login": "ababab",
                "password": "string2",
                "email": "somemail2@list.ru"
            })
        const firstUserChrome = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string1"
            })
            .set('user-agent', 'Chrome123')
            .set('x-forwarded-for', '165.95.1.0')
        const firstUserOpera =  request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string1"
            })
            .set('user-agent', 'Opera111')
            .set('x-forwarded-for', '165.95.1.0')
        const firstUserFirefox =  request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "asdasd",
                "password": "string1"
            })
            .set('user-agent', 'Firefox12')
            .set('x-forwarded-for', '165.95.1.0')
        const secondUser = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": "ababab",
                "password": "string2"
            })
            .set('user-agent', 'Chrome120')
            .set('x-forwarded-for', '165.95.1.0')
        const deleteAllOtherSessions = await request(app)
            .delete('/security/devices')
            .set('Cookie', firstUserChrome.headers['set-cookie'][0])
        const chekingForDelete = await request(app)
            .get('/security/devices')
            .set('Cookie', firstUserChrome.headers['set-cookie'][0])
        console.log(firstUserChrome.headers['set-cookie'][1])
        console.log( firstUserChrome.headers['set-cookie'][0])
        console.log(chekingForDelete.body)
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