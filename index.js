const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const admin = require('firebase-admin');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


var serviceAccount = require("./configs/libray-shop-firebase-adminsdk-me16w-84e0e2f55f.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

});

client.connect(err => {
    const bookCollection = client.db("BookShopDb").collection("books");

    app.get('/books', (req, res) => {
        bookCollection.find({})
            .toArray((err, items) => {
                res.send(items);

            })
    })
    app.get('/books/:_id', (req, res) => {
        bookCollection.find({_id: ObjectId(req.params._id) })
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

    const orderCollection = client.db("BookShopDb").collection("order");
    app.get('/orders', (req, res) => {
        orderCollection.find({})
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

           console.log(newOrder) ;
    })
    console.log("order database Connected", err);


});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})