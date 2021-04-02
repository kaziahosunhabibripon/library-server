const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookCollection = client.db("BookShopDb").collection("books");

    app.get('/books', (req, res)=>{
        bookCollection.find({})
        .toArray((err, items)=>{
            res.send(items);
            
        })
    })
    
    app.get('/books/:id', (req, res)=>{
        bookCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })  
    })
    
   

    app.post('/addBook', (req, res) => {
        const newEvent = req.body;
       
        bookCollection.insertOne(newEvent)
            .then(result => {
               
                res.send(result.insertedCount > 0);
        })
    })
    console.log("Connection error", err);


    
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})