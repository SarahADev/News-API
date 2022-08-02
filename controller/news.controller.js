const { selectTopics, selectArticleByID } = require('../model/news.model')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((response) => {
        res.status(200).send(response)
    })
    .catch(next)
}

exports.getArticleByID = (req, res, next) => {
    const {article_id} = req.params
    selectArticleByID(article_id)
    .then((output) => {
        res.status(200).send(output)
    })
    .catch(next)
}