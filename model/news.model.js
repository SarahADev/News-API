const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.author, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ;",
      [article_id]
    )
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Object not found" });
      } else {
        return res.rows[0];
      }
    });
};

exports.updateArticleByID = (article_id, newVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVotes, article_id]
    )
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Object not found" });
      } else {
        return res.rows[0];
      }
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = [
    "article_id",
    "title",
    "author",
    "topic",
    "votes",
    "created_at",
    "comment_count",
  ];
  const validOrder = ["asc", "desc", "ASC", "DESC"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr =
    "SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  if (topic !== undefined) {
    queryStr += ` WHERE articles.topic = '${topic}' GROUP BY articles.article_id `;
  } else {
    queryStr += " GROUP BY articles.article_id ";
  }

  queryStr += `ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr).then((res) => {
    if (res.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Object not found" });
    } else {
      return res.rows;
    }
  });
};

exports.selectCommentsByArticleID = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1",
      [article_id]
    )
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Object not found" });
      } else {
        return res.rows;
      }
    });
};

exports.insertCommentByArticleID = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentByCommentID = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((res) => {
      if (res.rowCount === 1) {
        return res.rowCount;
      } else if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Object not found" });
      }
    });
};
