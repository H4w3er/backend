import {app} from "../../src";
import request from "supertest";

describe('/post', ()=>{
    beforeAll(async()=>{
        await request(app).delete('/testing/all-data')
    })

    it('should return posts and 200', async ()=>{
        await request(app)
            .get('/posts')
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})