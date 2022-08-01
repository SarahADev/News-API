const { selectTopics } = require('../model/news.model')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((response) => {
        res.status(200).send(response)
    })
    .catch(next)
}