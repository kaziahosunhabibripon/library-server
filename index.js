const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const admin = require('firebase-admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


var serviceAccount = require("./configs/libray-shop-firebase-adminsdk-me16w-84e0e2f55f.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
   
});

client.connect(err => {
    const bookCollection = client.db("BookShopDb").collection("books");
    const orderCollection = client.db("BookShopDb").collection("order");
    app.get('/books', (req, res) => {
        bookCollection.find({})
            .toArray((err, items) => {
                res.send(items);

            })
    })
    app.get('/books/:_id', (req, res) => {
        bookCollection.find({_id: ObjectId(req.params._id) })
            .toArray( (err, items) => {
                console.log(items);
            })
    })
    
    app.post('/addBook', (req, res) => {
        const newEvent = req.body;
        bookCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0);
               
            })
    })

    app.delete('/delete/:id', (req,res)=>{
        bookCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result=>{
          res.send(result.deletedCount > 0);
        })

    })

    console.log("Connection error", err);
    
    app.get('/order', (req, res) => {
        
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
           
            admin.auth().verifyIdToken(idToken)
                .then(function (decodedToken) {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;     
                    if (tokenEmail == queryEmail) {
                        orderCollection.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                        })
                    }
                 
                })
                .catch((error) => {

            });
        }else{
            res.status(401).send('Unauthorized access');
        }
    })
   

    app.post('/order', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    console.log("Connection error", err);

    

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})