const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pg32v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log(process.env.DB_USER)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ema-jhon-server").collection("products");
  const orderCollection = client.db("ema-jhon-server").collection("orders");
  // perform actions on the collection object
  app.post('/addProduct', (req, res) => {
      const products = req.body;
      collection.insertMany(products)
      .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
      collection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/products/:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0])
    })
})

app.post('/productReview', (req, res) => {
    const productKeys = req.body;
    collection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})
 console.log('database connected')
});


app.get('/', (req, res) => {
    res.send('hello world')
});
app.listen(4000);