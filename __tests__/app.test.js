const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => {
  return seed(data);
});


describe('GET api/topics', () => {
    test('returns and array', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
        })
    });
    test('returns an array of objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            body.forEach((item => {
                return expect(typeof(item)).toBe('object')
            }))
        })
    });
    test('objects contain the slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            body.forEach((item => {
                return expect(item.hasOwnProperty('slug')).toBe(true)
            }))
            body.forEach((item => {
                return expect(item.hasOwnProperty('description')).toBe(true)
            }))
            body.forEach(item => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })

    });
});

describe('ALL /*', () => {
    test('responds with 404 not found when given non-existent endpoint', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg : 'Route not found'})
        })
    });
});