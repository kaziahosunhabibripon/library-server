const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const admin = require('firebase-admin');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookCollection = client.db("BookShopDb").collection("books");

    app.get('/books', (req, res) => {
        bookCollection.find({})
            .toArray((err, items) => {
                res.send(items);

            })
    })
    app.get('/books/:_id', (req, res) => {
        bookCollection.find({ _id: ObjectId(req.params._id) })
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.post('/addBook', (req, res) => {
        const newEvent = req.body;
        bookCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0);

            })
    })

    app.delete('/delete/:id', (req, res) => {
        bookCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })

    })

    console.log("Bookshop database connected", err);

});
client.connect(err => {

    const orderCollection = client.db("BookShopDb").collection("order");
    app.get('/order', (req, res) => {
        orderCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
            })

    })

    app.post('/order', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

    })
    console.log("order database Connected", err);

});

app.get('/', (req, res) => {
    res.send('Its working');
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})