const express = require("express");
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticleByID,
  patchArticleByID,
  getUsers,
  getArticles,
  getCommentsByArticleID,
  postCommentByArticleID,
  deleteCommentByCommentID,
  getEndpoints,
  getUsersByUsername,
  patchCommentVoteByID
} = require("./controller/news.controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.get('/api', getEndpoints)
app.get('/api/users/:username', getUsersByUsername)

app.post("/api/articles/:article_id/comments", postCommentByArticleID);

app.patch("/api/articles/:article_id", patchArticleByID);
app.patch("/api/comments/:comment_id", patchCommentVoteByID)

app.delete('/api/comments/:comment_id', deleteCommentByCommentID)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
///////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request, cannot insert into table" });
  } else {
    next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
