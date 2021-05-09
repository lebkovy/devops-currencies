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
  redisClient.get('cached_operations', async (err, result) => {
    if (!result) {
      const operations = await db.select().from(TABLE_NAME)
      redisClient.set('cached_operations', JSON.stringify(operations));
      res.send(operations);
    } else {
      console.log('Found cached_operations in Redis Client');
      res.send(result);
    }
  });
})

app.get(`/clear`, (req, res) => {
  redisClient.flushdb()
  res.end();
})

app.post(`/${TABLE_NAME}`, async (req, res) => {
  const [userId] = await db(TABLE_NAME).insert({ value: req.body.value, currency: req.body.currency }).returning('id');
  addToCache(userId, req.body.value, req.body.currency);
  res.json(userId);
})

app.post(`/${TABLE_NAME}/delete`, async (req, res) => {
  await db(TABLE_NAME).select().from(TABLE_NAME).where({id: req.body.id}).del();
  deleteFromCache(req.body.id);
  res.send();
})

app.put(`/${TABLE_NAME}/edit`, async (req, res) => {
  await db(TABLE_NAME).from(TABLE_NAME).where({id: req.body.operation.id}).update({value: req.body.operation.value, currency: req.body.operation.currency});
  editFromCache(req.body.operation.id, req.body.operation.value, req.body.operation.currency);
  res.send();
})

function editFromCache(id, value, currency) {
  redisClient.get('cached_operations', async (err, result) => {
    let operations;
    if (result) {
      operations = JSON.parse(result);
      const index = operations.findIndex((val) => val.id === id);
      if (index > -1) {
        operations[index].value = value;
        operations[index].currency = currency;
      }
      redisClient.set('cached_operations', JSON.stringify(operations));
    }
  });
}

function deleteFromCache(id) {
  redisClient.get('cached_operations', async (err, result) => {
    let operations;
    if (result) {
      operations = JSON.parse(result);
      operations = operations.filter((val) => val.id !== id);
      redisClient.set('cached_operations', JSON.stringify(operations));
    }
  });
}

function addToCache(id, value, currency) {
  const newObject = {id: id, value: value, currency: currency};
  redisClient.get('cached_operations', async (err, result) => {
    let operations;
    if (result) {
      operations = JSON.parse(result);
      operations = [...operations, newObject];
      redisClient.set('cached_operations', JSON.stringify(operations));
    }
  });
}
