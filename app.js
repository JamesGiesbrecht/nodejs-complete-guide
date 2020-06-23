const http = require('http')
const { promises: fs } = require('fs')

const PORT = 3000

const server = http.createServer((req, res) => {
  const { url, method } = req
  res.setHeader('Content-Type', 'text/html')
  if (url === '/') {
    res.write('<html>')
    res.write('<head><title>Enter Message</title></head>')
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></input></form></body>')
    res.write('</html>')
    return res.end()
  }
  if (url === '/message' && method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    })
    return req.on('end', async () => {
      const parsedBody = Buffer.concat(body).toString()
      const message = parsedBody.split('=')[1]
      await fs.writeFile('message.txt', message)
      res.statusCode = 302
      res.setHeader('Location', '/')
      return res.end()
    })
  }
  res.write('<html>')
  res.write('<head><title>My First Page</title></head>')
  res.write('<body><h1>Hello from my Node.js Server</h1></body>')
  res.write('</html>')
  return res.end()
})

server.listen(PORT)
