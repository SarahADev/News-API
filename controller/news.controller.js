const {
  selectTopics,
  selectArticleByID,
  updateArticleByID,
  selectCommentsByID,
  selectUsers,
  selectArticles,
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
    res.status(200).send({article : response})
  })
  .catch(next)
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

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((response) => {
        res.status(200).send({articles : response})
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    console.log(req.params)
    selectCommentsByID(article_id)
    .then((response) => {
        console.log(response, 'CONTROLLER')
        res.status(200).send({comments : response})
    })
    .catch((err) => {
        console.log(err, 'controller ERR')
        next(err)
    })
}