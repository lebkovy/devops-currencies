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

const tableName = 'operations';

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get('/drop', async (req, res) => {
//   await db.schema.dropTableIfExists(tableName)
//   await db.schema.withSchema('public').createTable(tableName, (table) => {
//     table.increments()
//     table.float('value')
//     table.string('currency')
//   })
//   res.send();
// })

app.get(`/${tableName}`, async (req, res) => {
  const operations = await db.select().from(tableName)
  res.json(operations)
})

app.get('/', async (req, res) => {
  res.send("Hello World");
})

app.post(`/${tableName}`, async (req, res) => {
  const [userId] = await db(tableName).insert({ value: req.body.value, currency: req.body.currency }).returning('id');
  res.json(userId);
})

app.post(`/${tableName}/delete`, async (req, res) => {
  await db(tableName).select().from(tableName).where({id: req.body.id}).del();
  res.send();
})

app.put(`/${tableName}/edit`, async (req, res) => {
  await db(tableName).from(tableName).where({id: req.body.operation.id}).update({value: req.body.operation.value, currency: req.body.operation.currency});
  res.send();
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
