const globalConfig = require('./config')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const server = require('./server/server')

app.use(express.static(__dirname +'/public'));

server.init(http)

http.listen(globalConfig.PORT, globalConfig.HOST, () => {
  console.log(`listening on '${globalConfig.HOST}:${globalConfig.PORT}`)
})
