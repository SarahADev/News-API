const express = require('express')
const app = express()
//app.use(express.json())

const { getTopics } = require('./controller/news.controller')

app.get('/api/topics', getTopics)



app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})
///////////////////////////////////////////////////////

app.use((err, req, res, next) => {
    console.log('500 catch')
    res.status(err.status).send({msg:err.msg});
})

module.exports = app