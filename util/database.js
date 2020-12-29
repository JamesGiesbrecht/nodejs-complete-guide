const mongodb = require('mongodb')
const { MongoClient } = mongodb

const mongoConnect = (cb) => {
  MongoClient
    .connect('mongodb+srv://nodejs-user:nodejs-password@nodejs-complete-guide.bpxav.mongodb.net/nodejs-complete-guide?retryWrites=true&w=majority')
    .then((client) => {
      console.log('Connected to MongoDB')
      cb(client)
    })
    .catch((error) => console.log(error))
}

module.exports = mongoConnect
