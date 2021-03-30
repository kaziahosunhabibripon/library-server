const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COL}`);

    app.get('/books', (req, res)=>{
        bookCollection.find()
        .toArray((err, items)=>{
            res.send(items);
            
        })
    })

    app.post('/addBook', (req, res) => {
        const newEvent = req.body;
        console.log("add new book", newEvent);
        bookCollection.insertOne(newEvent)
            .then(result => {
                console.log('Received', result.insertedCount);
                res.send(result.insertedCount > 0);
        })
    })
    console.log("Connection error", err);


    
});


app.get('/', (req, res) => {
    res.send('Database Connected');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})