const http = require('http')
const fs = require('fs')
const path = require('path')
const globalConfig = require('./config')

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    const ext = path.extname(filePath)
    let contentType = 'text/html'

    if (!ext) {
        filePath += '.html'
    }

    switch (ext) {
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break
        case '.test':
            contentType = 'text/plain'
            break
        default:
            contentType = 'text/html'
            // break
    }

    console.log(req.url)
    fs.readFile(filePath, (err, content) => {
        if (err) {
            throw err
        } else {
            res.writeHead(200, {'Content-Type': contentType})
            res.end(content)
        }
    })
})

// const express = require('express')
// const app = express()

// app.get("/", (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))

const chalk = require('chalk')

server.listen(globalConfig.PORT, () => {
    console.log('Server has been started on ' + chalk.blue(globalConfig.PORT) + '...')
})
