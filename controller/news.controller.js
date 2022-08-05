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
  insertArticle
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
    .then(({results, total_count}) => {
      res.status(200).send({ articles: results , total_count : total_count});
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const {limit, page} = req.query
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
        Description: "Deletes the comment with the associated comment_id.",
      },
    ],
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