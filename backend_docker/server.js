const express = require('express')
const redis = require('redis')
const cors = require('cors')

const PORT = process.env.PORT || 5000
const app = express()
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(PORT,  () => {
  pgClient.
  query('CREATE TABLE IF NOT EXISTS operations (id SERIAL PRIMARY KEY, value NUMERIC(15, 2), currency VARCHAR(15));').
  then(() => {
    console.log(`Server listening on port ${PORT}`);
  }).
  catch((err) => {
    console.log("Error while creating table\n"+err);
  });
})

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })

const { Pool } = require('pg');

const pgClient = new Pool({
  user: "docker",
  password: "12345",
  database: "docker",
  host: "db",
  port: "5432"

});

pgClient.on('error', () => {
  console.log("Postgres not connected!");
});

pgClient.on('connect', () =>{
  console.log("Connected to Postgres server!");
});

app.get("/check", (req, res) => {
  res.send("[Docker] API WORKS! (/api)");
});

app.get("/operations", (req, res) => {
  redisClient.get('cached_operations', (err, result) => {
    if (!result) {
      pgClient.
      query('SELECT * FROM operations;').
      then(result => {
        res.status(200).json(result.rows)
      }).
      catch((err) => {
        res.send(err);
      });
    } else {
      console.log('Found cached_operations in Redis Client');
      res.send(result);
    }
  });
})

app.post("/operations",  (req, res) => {
  const { value, currency } = req.body
  pgClient.
  query('INSERT INTO operations (value, currency) VALUES ($1, $2) RETURNING id;', [value, currency]).
  then(result => {
    const id = result.rows[0].id;
    addToCache(id, value, currency);
    res.status(200).json(result.rows[0].id)
  }).
  catch((err) => {
    res.send(err);
  });
})

app.post("/operations/delete",  (req, res) => {
  const { id } = req.body;
  pgClient.
  query('DELETE FROM operations WHERE id = $1', [id]).
  then(result => {
    const id = result.rows[0].id;
    deleteFromCache(id);
    res.status(200).send();
  }).
  catch((err) => {
    res.send(err);
  });
})

app.put("/operations", async (req, res) => {
  const { id, value, currency } = req.body;
  pgClient.
  query('UPDATE operations SET value = $1, currency = $2 WHERE id = $3', [value, currency, id]).
  then(result => {
    const id = result.rows[0].id;
    editFromCache(id, value, currency);
    res.status(200).send();
  }).
  catch((err) => {
    res.send(err);
  });
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
