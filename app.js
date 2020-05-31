const http = require('http')

const PORT = 3000

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers)
})

server.listen(PORT)
