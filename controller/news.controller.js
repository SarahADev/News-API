const { response } = require("../app");
const {
  selectTopics,
  selectArticleByID,
  updateArticleByID,
  selectCommentsByArticleID,
  selectUsers,
  selectArticles,
  insertCommentByArticleID,
  removeCommentByCommentID,
  selectUsersByUsername,
  updateCommentVoteByID,
  insertArticle,
  insertTopic,
  removeArticleByArticleID,
  removeCommentsbyArticleID,
} = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send({ topics: response });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  if (!req.body.hasOwnProperty("inc_votes")) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleByID(article_id, inc_votes)
      .then((output) => {
        res.status(200).send({ updatedArticle: output });
      })
      .catch(next);
  }
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((response) => {
      res.status(200).send({ users: response });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query;
  selectArticles(sort_by, order, topic, limit, page)
    .then(({ results, total_count }) => {
      res.status(200).send({ articles: results, total_count: total_count });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, page } = req.query;
  selectCommentsByArticleID(article_id, limit, page)
    .then((response) => {
      res.status(200).send({ comments: response });
    })
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleID(article_id, username, body)
    .then((response) => {
      res.status(201).send({ addedComment: response });
    })
    .catch(next);
};

exports.deleteCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentID(comment_id)
    .then((response) => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  const endpoints = {
    Endpoints: {
      "GET /api/articles": {
        description: "Responds with an array of all articles",
        queries: ["sort_by", "order", "topic", "limit", "page"],
        exampleResponse: {
          articles: [
            {
              article_id: 1,
              title: "Running a Node App",
              author: "jessjelly",
              topic: "coding",
              created_at: "2020-11-07T06:03:00.000Z",
              votes: 0,
              comment_count: 8,
            },
          ],
        },
      },
      "POST /api/articles": {
        description: "Creates a new article",
        requestBody: {
          keys: [
            "author (String)",
            "title (String)",
            "body (String)",
            "topic (String)",
          ],
          exampleBody: {
            author: "butter_bridge",
            title: "Good names",
            body: "If the cat is orange, Mango is a nice name",
            topic: "cats",
          },
        },
        exampleResponse: {
          addedArticle: [
            {
              article_id: 13,
              title: "Good names",
              topic: "cats",
              author: "butter_bridge",
              body: "If the cat is orange, Mango is a nice name",
              created_at: "2022-08-20T13:44:15.531Z",
              votes: 0,
            },
          ],
        },
      },
      "GET /api/articles/:article_id": {
        description: "Returns a single article",
        exampleResponse: {
          article: [
            {
              article_id: 1,
              title: "Running a Node App",
              author: "jessjelly",
              body: "This is part two of a series on how to get up and running with Systemd and Node.js.",
              topic: "coding",
              created_at: "2020-11-07T06:03:00.000Z",
              votes: 0,
              comment_count: 8,
            },
          ],
        },
      },
      "PATCH /api/articles/:article_id": {
        description: "Updates an article",
        requestBody: {
          keys: ["inc_votes (Integer)"],
          exampleBody: { inc_votes: 3 },
        },
        exampleResponse: {
          updatedArticle: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 103,
          },
        },
      },
      "DELETE /api/articles/:article_id": {
        description: "Deletes a single article",
        exampleResponse:
          "Status 204- No Content. No body is returned by this endpoint.",
      },
      "GET /api/articles/:article_id/comments": {
        description:
          "Returns an array of comments associated with a single article",
        exampleResponse: {
          comments: [
            {
              comment_id: 2,
              votes: 14,
              created_at: "2020-10-31T03:03:00.000Z",
              author: "butter_bridge",
              body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            },
            {
              comment_id: 3,
              votes: 100,
              created_at: "2020-03-01T01:13:00.000Z",
              author: "icellusedkars",
              body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            },
          ],
        },
      },
      "POST /api/articles/:article_id/comments": {
        description: "Creates a new comment on an article",
        requestBody: {
          keys: ["username (String)", "body (String"],
          exampleBody: {
            username: "butter_bridge",
            body: "A comment here",
          },
        },
        exampleResponse: {
          addedComment: {
            comment_id: 19,
            body: "A comment here",
            article_id: 1,
            author: "butter_bridge",
            votes: 0,
            created_at: "2022-08-20T14:05:55.587Z",
          },
        },
      },
      "PATCH /api/comments/:comment_id": {
        description: "Updates a single comments votes.",
        requestBody: {
          keys: ["inc_votes (Integer"],
          exampleBody: { inc_votes: 3 },
        },
        exampleResponse: {
          updatedComment: {
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 19,
            created_at: "2020-04-06T12:17:00.000Z",
          },
        },
      },
      "DELETE /api/comments/:comment_id": {
        description: "Deletes a single comment.",
        exampleResponse:
          "Status 204- No Content. No body is returned by this endpoint.",
      },
      "GET /api/topics": {
        description: "Returns an array of all topics.",
        exampleResponse: {
          topics: [
            { slug: "coding", description: "Code is love, code is life" },
            { slug: "football", description: "FOOTIE!" },
            {
              slug: "cooking",
              description: "Hey good looking, what you got cooking?",
            },
          ],
        },
      },
      "POST /api/topics": {
        description: "Adds a topic",
        requestBody: {
          keys: ["slug (String)", "description (String"],
          exampleBody: { slug: "squirrels", description: "rodents but cute" },
        },
        exampleResponse: {
          addedTopic: { slug: "squirrels", description: "rodents but cute" },
        },
      },
      "GET /api/users": {
        description: "Returns an array of all users.",
        exampleResponse: {
          users: [
            {
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            },
            {
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            },
          ],
        },
      },
      "GET /api/users/:username": {
        description: "Returns a single user",
        exampleResponse: {
          user: {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
        },
      },
    },
  };
  res.status(200).json(endpoints);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsersByUsername(username)
    .then((response) => {
      res.status(200).send({ user: response });
    })
    .catch(next);
};

exports.patchCommentVoteByID = (req, res, next) => {
  if (!req.body.hasOwnProperty("inc_votes")) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateCommentVoteByID(comment_id, inc_votes)
      .then((output) => {
        res.status(200).send({ updatedComment: output });
      })
      .catch(next);
  }
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((response) => {
      res.status(201).send({ addedArticle: response });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  insertTopic(slug, description)
    .then((response) => {
      res.status(201).send({ addedTopic: response });
    })
    .catch(next);
};

exports.deleteArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((response) => {
      if (response.comment_count > 0) {
        removeCommentsbyArticleID(article_id)
          .then((response) => {
            removeArticleByArticleID(article_id)
              .then((response) => {
                res.sendStatus(204);
              })
              .catch(next);
          })
          .catch(next);
      } else {
        removeArticleByArticleID(article_id)
          .then((response) => {
            res.sendStatus(204);
          })
          .catch(next);
      }
    })
    .catch(next);
};
