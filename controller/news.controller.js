const {
  selectTopics,
  selectArticleByID,
  updateArticleByID,
  selectUsers
} = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send({ articles: response });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((output) => {
      res.status(200).send({ article: output });
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
        ("controller then");
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
