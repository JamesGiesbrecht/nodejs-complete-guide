const requestHandler = (req, res) => {
  const { url, method } = req
  const users = [
    'John',
    'Veronica',
    'Jacob',
    'Tom',
    'Sally',
  ]

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>Create User</title></head>')
    res.write('<body>')
    res.write('<h1>Welcome!</h1>')
    res.write('<form action="/create-user" method="POST"><label>Username:</label><input type="text" name="username"><button type="submit">Submit</button></input></form>')
    res.write('</body>')
    res.write('</html>')
  }
  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>Users</title></head>')
    res.write('<body><ul>')
    users.forEach((user) => {
      res.write(`<li>${user}</li>`)
    })
    res.write('</ul></body>')
    res.write('</html>')
  }
  //  Send 404 page
  if (url === '/create-user' && method === 'POST') {
    const body = []
    req.on('data', (chunk) => body.push(chunk))

    return req.on('end', async () => {
      const parsedBody = Buffer.concat(body).toString()
      const username = parsedBody.split('=')[1]
      console.log(username)
      res.statusCode = 302
      res.setHeader('Location', '/')
      return res.end()
    })
  }
  return res.end()
}

module.exports = requestHandler
