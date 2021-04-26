const express = require('express')
const redis = require('redis')
const cors = require('cors')
const db = require('./db')

const PORT = process.env.PORT || 5000
const app = express()
const redisClient = redis.createClient({host: "redis", port: 6379})
const TABLE_NAME = 'operations';

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })

// app.get('/drop', async (req, res) => {
//   await db.schema.dropTableIfExists(TABLE_NAME)
//   await db.schema.withSchema('public').createTable(TABLE_NAME, (table) => {
//     table.increments()
//     table.float('value')
//     table.string('currency')
//   })
//   res.send();
// })

app.get(`/${TABLE_NAME}`, async (req, res) => {
  redisClient.get('operations', async (err, result) => {
    if (!result) {
      const operations = await db.select().from(TABLE_NAME)
      redisClient.set('operations', JSON.stringify(operations));
      res.send(operations);
    } else {
      res.send(result);
    }
  });
})

app.post(`/${TABLE_NAME}`, async (req, res) => {
  const [userId] = await db(TABLE_NAME).insert({ value: req.body.value, currency: req.body.currency }).returning('id');
  res.json(userId);
})

app.post(`/${TABLE_NAME}/delete`, async (req, res) => {
  await db(TABLE_NAME).select().from(TABLE_NAME).where({id: req.body.id}).del();
  res.send();
})

app.put(`/${TABLE_NAME}/edit`, async (req, res) => {
  await db(TABLE_NAME).from(TABLE_NAME).where({id: req.body.operation.id}).update({value: req.body.operation.value, currency: req.body.operation.currency});
  res.send();
})
