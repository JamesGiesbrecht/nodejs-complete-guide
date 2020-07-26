const express = require('express')

const app = express()
const PORT = 3000

//  Add new middleware function
//  Function will be executed on every incoming request
app.use((req, res, next) => {
  console.log("I'm in the middleware!")
  //  Calling next allows it to travel to the next middleware
  //  If its the last stop, send a response instead
  next()
})

app.use((req, res, next) => {
  console.log("I'm in another middleware!")
  res.send('<h1>Hello from Express</h1>')
})

app.listen(PORT)

// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
