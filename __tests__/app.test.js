const db = require("../db/connection");
const request = require("supertest");
require("jest-sorted");
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
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
  test("returns an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBeGreaterThan(1);
        body.topics.forEach((item) => {
          return expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("objects contain the slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBeGreaterThan(1);
        body.topics.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              slug: expect.anything(),
              description: expect.anything(),
            })
          );
        });
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
        expect(Array.isArray(body.article)).toBe(false);
        expect(typeof body.article).toBe("object");
      });
  });
  test("object contains following properties: article_id, author, title, body, topic, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
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
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Bad request- valid but out of range- returns 404 object not found", () => {
    return request(app)
      .get("/api/articles/900000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("takes an object and returns the updated article object", () => {
    const input = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toBeInstanceOf(Object);
      });
  });
  test("increments the votes with a positive number", () => {
    const input = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle.votes).toBe(110);
      });
  });
  test("decrements the votes with a negative number", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle.votes).toBe(90);
      });
  });
  test("wrong format of input returns 400 bad request", () => {
    const input = { nonsense: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("invalid value input returns 400 bad request", () => {
    const input = { inc_votes: "nonsense" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("accesses the correct article", () => {
    const input = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.article_id).toBe(1);
      });
  });
  test("valid but out of range article returns 404 not found", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/900")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
  test("invalid article value returns 400 bad request", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/nonsense")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("returned object should include comment property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article.hasOwnProperty("comment_count")).toBe(true);
      });
  });
});

describe("GET /api/users", () => {
  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(1);
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((item) => {
          return expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("contains the properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(1);
        body.users.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              username: expect.anything(),
              name: expect.anything(),
              avatar_url: expect.anything(),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(1);
        body.articles.forEach((item) => {
          expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("article objects contain properties: author, title, article_id, topic, created_at, votes, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(1);
        body.articles.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              author: expect.anything(),
              title: expect.anything(),
              article_id: expect.anything(),
              topic: expect.anything(),
              created_at: expect.anything(),
              votes: expect.anything(),
              comment_count: expect.anything(),
            })
          );
        });
      });
  });
  test("articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBeGreaterThan(1);
        body.comments.forEach((item) => {
          expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("comment objects contain the properties: comment_id, votes, created_at, author, body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(1);
        body.comments.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              comment_id: expect.anything(),
              votes: expect.anything(),
              created_at: expect.anything(),
              author: expect.anything(),
              body: expect.anything(),
            })
          );
        });
      });
  });
  test("invalid article_id should return 400 bad request", () => {
    return request(app)
      .get("/api/articles/bananas/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("valid but out of range article_id should return 404 not found", () => {
    return request(app)
      .get("/api/articles/900000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
});

describe("GET /api/articles (queries)", () => {
  describe("sort_by", () => {
    test("should sort by input query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("if no input, defaults to date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("invalid value returns 400 bad request", () => {
      return request(app)
        .get("/api/articles?sort_by=nonsense")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("order", () => {
    test("can order by ASC", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    test("can order by DESC", () => {
      return request(app)
        .get("/api/articles?order=DESC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("if no input, defaults to desc", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("invalid input value returns 400 bad request", () => {
      return request(app)
        .get("/api/articles?order=nonsense")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("topic", () => {
    test("should filter by input topic cats", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].topic).toBe("cats");
        });
    });
    test("filters for mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(1);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("if no input, no articles are filtered out", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(1);
          let mitchCount = 0;
          let catsCount = 0;
          body.articles.forEach((article) => {
            if (article.topic === "cats") {
              catsCount++;
            } else if (article.topic === "mitch") {
              mitchCount++;
            }
          });
          expect(mitchCount).not.toBe(0);
          expect(catsCount).not.toBe(0);
          // expect(body.articles.length).toBe(12); BRITTLE TEST< LIMIT BREAKS THIS
        });
    });
    test("non-existent input value returns 404 not found", () => {
      return request(app)
        .get("/api/articles?topic=nonsense")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Object not found");
        });
    });
  });
  describe("All 3 queries at once", () => {
    test("can sort_by, order and filter by topic", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=ASC&&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(1);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
          expect(body.articles).toBeSortedBy("author", {
            ascending: true,
          });
        });
    });
  });
  test("Valid topic but no associated articles returns 404 object not found", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("returns an object", () => {
    const input = {
      username: "butter_bridge",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedComment).toBeInstanceOf(Object);
      });
  });
  test("should return 201 and the posted comment", () => {
    const input = {
      username: "butter_bridge",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedComment.article_id).toBe(1);
        expect(body.addedComment.author).toBe(input.username);
        expect(body.addedComment.body).toBe(input.body);
      });
  });
  test("posted comment contains the author, comment_id, article_id, body, created_at and votes properties", () => {
    const input = {
      username: "butter_bridge",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedComment).toEqual(
          expect.objectContaining({
            author: expect.anything(),
            comment_id: expect.anything(),
            body: expect.anything(),
            article_id: expect.anything(),
            created_at: expect.anything(),
            votes: expect.anything(),
          })
        );
      });
  });
  test("invalid body value returns 400 Bad request, cannot insert into table", () => {
    const input = {
      username: "butter_bridge",
      body: null,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, cannot insert into table");
      });
  });
  test("invalid username value returns 400 Bad request, cannot insert into table", () => {
    const input = {
      username: "NotAUSer",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("input format returns 400 Bad request", () => {
    const input = {
      wrong: "butter_bridge",
      format: "A comment here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, cannot insert into table");
      });
  });
  test("invalid article ID", () => {
    const input = {
      username: "butter_bridge",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/nonsense/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("valid, out of range article ID", () => {
    const input = {
      username: "butter_bridge",
      body: "A comment here",
    };
    return request(app)
      .post("/api/articles/900/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Deleted comment returns 204 no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("Invalid comment_id returns 400 bad request", () => {
    return request(app)
      .delete("/api/comments/nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Valid but out of range comment_id returns 404 object not found", () => {
    return request(app)
      .delete("/api/comments/900")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
});

describe("GET /api", () => {
  //brittle test
  test("returns a JSON describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          Endpoints: [
            {
              Endpoint: "GET /api/topics",
              Description:
                "Returns an array of topic objects, including slug and description properties.",
            },
            {
              Endpoint: "GET /api/users",
              Description: "Responds with an array of user objects.",
            },
            {
              Endpoint: "GET /api/articles",
              Description:
                "Returns an array of article objects, including the comment count for each article. Optional queries of sort_by, order and topic to sort and filter the returned array.",
            },
            {
              Endpoint: "GET /api/articles/:article_id",
              Description:
                "Returns the article with associated article_id, including the count of associated comments.",
            },
            {
              Endpoint: "PATCH /api/articles/:article_id",
              Description:
                "Takes an object with inc_votes property and INT value, and amends the vote count on the associated article by the value. (E.g. { inc_votes : 3 } )",
            },
            {
              Endpoint: "GET /api/articles/:article_id/comments",
              Description:
                "Returns an array of comments with the associated article_id number.",
            },
            {
              Endpoint: "POST /api/articles/:article_id/comments",
              Description:
                'Takes an object of an authorised user (username) and comment (body), and posts the comment. (E.g. { username : "User", body : "Comment"} )',
            },
            {
              Endpoint: "DELETE /api/comments/:comment_id",
              Description:
                "Deletes the comment with the associated comment_id.",
            },
          ],
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("returns a single user object with associatied username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toBeInstanceOf(Object);
        expect(body.user.username).toBe("lurker");
      });
  });
  test("valid but out of range returns 404 object not found", () => {
    return request(app)
      .get("/api/users/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("numbers only also count as valid", () => {
    return request(app)
      .get("/api/users/900")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("takes an object and returns the updated comment object", () => {
    const input = { inc_votes: 3 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toBeInstanceOf(Object);
      });
  });
  test("increments the votes with a positive number", () => {
    const input = { inc_votes: 10 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.votes).toBe(26);
      });
  });
  test("decrements the votes with a negative number", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.votes).toBe(6);
      });
  });
  test("wrong format of input returns 400 bad request", () => {
    const input = { nonsense: 3 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("invalid value input returns 400 bad request", () => {
    const input = { inc_votes: "nonsense" };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("accesses the correct article", () => {
    const input = { inc_votes: 0 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.comment_id).toBe(1);
      });
  });
  test("valid but out of range article returns 404 not found", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/900")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
  test("invalid article value returns 400 bad request", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/nonsense")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("returns an object", () => {
    const input = {
      author: "butter_bridge",
      title: "Good names",
      body: "If the cat is orange, Mango is a nice name",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedArticle).toBeInstanceOf(Object);
      });
  });
  test("should return 201 and the posted comment", () => {
    const input = {
      author: "butter_bridge",
      title: "Good names",
      body: "If the cat is orange, Mango is a nice name",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedArticle.author).toBe(input.author);
        expect(body.addedArticle.title).toBe(input.title);
        expect(body.addedArticle.body).toBe(input.body);
        expect(body.addedArticle.topic).toBe(input.topic);
      });
  });
  test("posted comment contains the author, article_id, body, created_at and votes properties", () => {
    const input = {
      author: "butter_bridge",
      title: "Good names",
      body: "If the cat is orange, Mango is a nice name",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedArticle).toEqual(
          expect.objectContaining({
            author: expect.anything(),
            title: expect.anything(),
            body: expect.anything(),
            article_id: expect.anything(),
            topic: expect.anything(),
            created_at: expect.anything(),
            votes: expect.anything(),
          })
        );
      });
  });
  test("invalid body value returns 400 Bad request, cannot insert into table", () => {
    const input = {
      author: "butter_bridge",
      title: "Good names",
      body: null,
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, cannot insert into table");
      });
  });
  test("invalid username value returns 400 Bad request, cannot insert into table", () => {
    const input = {
      author: "rando",
      title: "Good names",
      body: "If the cat is orange, Mango is a nice name",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("invalid input format returns 400 Bad request", () => {
    const input = {
      wrong: "butter_bridge",
      format: "Good names",
      goes: "If the cat is orange, Mango is a nice name",
      here: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, cannot insert into table");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("limits result number to limit query and displays total count", () => {
    return request(app)
      .get("/api/articles?limit=5&&sort_by=article_id&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
        expect(body.total_count).toBe(12);
        expect(body.hasOwnProperty("total_count")).toBe(true);
      });
  });
  test("default limit is 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("Invalid limit value returns 400 bad request", () => {
    return request(app)
      .get("/api/articles?limit=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Negative or 0 limit number returns 400 bad request", () => {
    return request(app)
      .get("/api/articles?limit=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("page query will show the next available articles, calculated using limit", () => {
    return request(app)
      .get("/api/articles?limit=5&&page=2&&sort_by=article_id&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(6);
        expect(body.articles[4].article_id).toBe(10);
      });
  });
  test("remainder page displays only remaining results despite limit", () => {
    return request(app)
      .get("/api/articles?limit=5&&page=3&&sort_by=article_id&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(2);
      });
  });
  test("default page value is 1", () => {
    return request(app)
      .get("/api/articles?limit=5&&page=1&&sort_by=article_id&&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(1);
        expect(body.articles[4].article_id).toBe(5);
      });
  });
  test("invalid page query will return 400 bad request", () => {
    return request(app)
      .get("/api/articles?page=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments (pagination)", () => {
  test("query limit should limit number of results by specified value", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
      });
  });
  test("limit should default to 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });
  test("0 or negative number limit value should return 400 bad request", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("invalid limit value returns 400 bad request", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("page query shows relevant comments based on limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&&page=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
      });
  });
  test("default page value is 1", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&&page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
        //how to properly test this without sort_by?
      });
  });
});

describe.only("POST /api/topics", () => {
  test("returns an object of the posted topic", () => {
    const input = {
      slug: "squirrels",
      description: "rodents but cute",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedTopic).toBeInstanceOf(Object);
      });
  });
  test("has properties of slug and description", () => {
    const input = {
      slug: "squirrels",
      description: "rodents but cute",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.addedTopic).toEqual(
          expect.objectContaining({
            slug: expect.anything(),
            description: expect.anything(),
          })
        );
      });
  });
  test("invalid format returns 400 bad request", () => {
    const input = {
      wrong: "squirrels",
      format: "rodents but cute",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request, cannot insert into table')
      });
  });
  test("invalid value for slug returns 400 bad request", () => {
    const input = {
      slug: null,
      description: "rodents but cute",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request, cannot insert into table')
      });
  });
});
