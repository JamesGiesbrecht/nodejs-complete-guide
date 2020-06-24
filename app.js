const http = require('http')

const routes = require('./routes')

const PORT = 3000

const server = http.createServer(routes)

server.listen(PORT)
// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
