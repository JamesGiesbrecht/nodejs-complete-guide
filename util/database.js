const mongodb = require('mongodb')

const { MongoClient } = mongodb

let db

const mongoConnect = (cb) => {
  MongoClient
    .connect('mongodb+srv://nodejs-user:nodejs-password@nodejs-complete-guide.bpxav.mongodb.net/DBNAME?retryWrites=true&w=majority')
    .then((client) => {
      console.log('Connected to MongoDB')
      db = client.db()
      cb()
    })
    .catch((error) => {
      console.log(error)
      throw error
    })
}

const getDb = () => {
  if (db) return db
  throw new Error('No database found')
}

module.exports = { mongoConnect, getDb }
