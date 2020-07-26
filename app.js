const http = require('http')

const express = require('express')

const app = express()
const PORT = 3000

const server = http.createServer(app)

server.listen(PORT)
// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
