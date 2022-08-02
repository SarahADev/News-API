const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => {
  return seed(data);
});

describe("GET api/topics", () => {
  test("returns an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });
  test("returns an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((item) => {
          return expect(typeof item).toBe("object");
        });
      });
  });
  test("objects contain the slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((item) => {
          return expect(item.hasOwnProperty("slug")).toBe(true);
        });
        body.forEach((item) => {
          return expect(item.hasOwnProperty("description")).toBe(true);
        });
        body.forEach(item => {
           expect(item).toEqual(expect.objectContaining({
                slug: expect.anything(),
                description: expect.anything()
            }))
        })
      });
  });
});

describe("ALL /*", () => {
  test("responds with 404 not found when given non-existent endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Route not found" });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns an object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(false);
        expect(typeof body).toBe("object");
      });
  });
  test("object contains following properties: article_id, author, title, body, topic, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: expect.anything(),
            author: expect.anything(),
            title: expect.anything(),
            body: expect.anything(),
            topic: expect.anything(),
            created_at: expect.anything(),
            votes: expect.anything(),
          })
        );
      });
  });
  test("Bad request- invalid- returns 400 bad request", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request')
      });
  });
  test("Bad request- valid but out of range- returns 404 object not found", () => {
    return request(app)
      .get("/api/articles/900000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Object not found')
      });
  });
});
