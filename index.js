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




var serviceAccount = {
    "type": "service_account",
    "project_id": "libray-shop",
    "private_key_id": "d4644c4b2d72eccbdca827c0c491356d87c8ad96",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAFY5dK0Qezjkg\nz3iAd0MMkUBzPUGweOkS5WXOVdU+Zb9GG+RNAcKBfgsVwyDbQFEdSfDHxB2iKqm/\npmu1Ct5NAyo3CuNCInG8r/ELax0sMSd340Y8ZQ1sKUk37f/pS2uLG0jWlY/LPpUv\nvDj6SLbqQfwyvizq7o6hOheUNG8+rK4XPBCz17E9h4ThlKGrYhNHkj4X9CJlbGW9\nAOX4n9PShef9tsHVaLYPP3DpnOb+3DF8BbmF62Y4LM4Piz43C1E+8LamFt2Z+BND\n4G80Vk10UAZto0JoCUly60aea04W+Vkbi/yZ9r3ILTHLY5ipIRs6fpQiwy8ekBFp\nw5YUghLpAgMBAAECggEADmkfmOBP2ELO+OXvy62G33i/PdYM6VUs4UDKEkCQwsFl\n5/fcOSXGZqoi4UNWIfTRkRG0yXvuYDX0rb7pyjeSRXNVFbOQqKvGXipR+nITCnd2\nl1E6+fl32BNB3bsSjbldjF5j6MtoMg6UKTRlDuvpIyqHpfPsEUUL+M8PqUwEw44W\nIInf/qE70mcibf2GNuTKHbhx0A4hFVjVwZJzIV6cPsY8Dflcz/Dy8z0amlDUaJwO\nQUYz6+SJOlxwyOQc4oqSsDPG0txIl5bLwe6fhVch7+bV5ZO4kXUtLq5DGE1RBuKZ\nFnR68eGufgUe95lm9wyN8FrCNePrYJBwD5HsZ5P0gQKBgQDp3GgshPTeAzkPfkcM\nBlyjql01p0xrEQ356odlWiGdNVs0iRo4Q/Usk1iQlliNR/dm6KGXe2WgS18oikn7\nocgxrCrF/y+rKJrK1Spcm7dsC3c0U9DOSJ7+66uBuwShp8GLYfQj3UPUgvgtpoyN\nHszotFItdS/L9bExHDppIuJVwQKBgQDSRLG71L8Owli5dXoQqC8gyMVfrZ2RomU1\n5hEtAlGcryGFJOa+bSJRfUC2hQvl8mHMSi/wT+4R5V//wuGmnyGN44fjUNFiKzXF\nquTOHfgR19A6JevoIarYyFXsF2GodC8SIAgBBJ9rMV0bvqpeSkxwpQnxQmb5LaT1\nT7yKeA4XKQKBgCo2xP80SNdCkaxASSbchyBsAkNLHbo9693u/d3HtUWhegMztG3v\npnQTbOs8mGN4WCpVV8X2WlPjBxxUSiKIA5Ej2NzAwaQNwlNWwzzQRv3T3AKwFoMG\nDN1LQTw7vAxKMd+tINrQeAwGUDI9XCWlJ6vh0OuvuZ8BjKimxcxwpZaBAoGAJnCS\ngYEiMIONDtKQLy1f+EFb++LUdIRYtmLJ7w2Gd/t4SEv3twZiiL06MGPgSfhmsp85\nZlhmcHUbeLla4UgkLTlUZVUoAideHDXiwF+wMyreEVNPbk+BWUI+mvunSdF7rXeX\nnwAGWOVcXS8dHEG++bTiPW3jP1h92K7sC/BouwkCgYA0zrMhytYBO7ZTxry+UV0w\nMyXQi2cNt/uUGMVk5ldVtrGo9FlLKpNVsrV+kMPp/oUi4isPUxktzxf5Mn9pYx7H\nbqS9y+Ia2/byiSsoKs+sBFQ2DUsPUtmE1F5ay0idtFwXnsRXZZNHuULJWtTtY/jK\nsOaCrDTaJm4Z3x5Qp9UjrA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-me16w@libray-shop.iam.gserviceaccount.com",
    "client_id": "111683101286490208225",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-me16w%40libray-shop.iam.gserviceaccount.com"
  };
  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRE_DB
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
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            admin.auth().verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;      
                    if (tokenEmail == queryEmail) {
                        orderCollection.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                            })
                    }
                    
                }).catch((error) => {
                    res.status(401).send('Unauthorized Access');
                });
        }
        else{
            res.status(401).send('Unauthorized Access')

        }
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