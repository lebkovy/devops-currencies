const express = require('express')
const morgan = require('morgan')
const redis = require('redis')
const cors = require('cors')

const db = require('./db')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())

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
  await db('users').insert({ name: req.body.name });
  const users = await db.select().from('users');
  res.json(users)
})

app.post('/users/delete', async (req, res) => {
  await db('users').select().from('users').where({id: req.body.id}).del();
  const users = await db.select().from('users')
  res.json(users)
})

app.put('/users/edit', async (req, res) => {
  await db('users').from('users').where({id: req.body.id}).update({name: req.body.name});
  const users = await db.select().from('users')
  res.json(users)
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
