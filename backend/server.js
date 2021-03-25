const express = require('express')
const morgan = require('morgan')
const redis = require('redis')

const db = require('./db')

const PORT = process.env.PORT || 5000
const app = express()

const redisClient = redis.createClient({
  host: "redis",
  port: 6379
})

redisClient.on('connect', () => {
  console.log('Connected to the Redis server');
})

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/users', async (req, res) => {
  const users = await db.select().from('users')
  res.json(users)
})

app.post('/users', async (req, res) => {
  const user = await db('users').insert({ name: req.body.name }).returning('*')
  res.json(user)
})

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))
