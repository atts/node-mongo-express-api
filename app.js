const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongojs');
const db = mongo('catalogue', ['products']); // first parameter is name of DB and 2nd parameter is name of collection
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log("listening to port : " + port);
});

// default route
app.get('/', (req, res, next) => {
    res.send("api running...");
});

// route to read the document data from collection
app.get('/api/products', (req, res, next) => {
    db.products.find((err, docs) => {
        if (err) {
            res.send(err);
        }
        res.json(docs);
    });
})

// route to read particular document from collection using ID
app.get('/api/products/:id', (req, res, next) => {
    db.products.findOne({ _id: mongo.ObjectId(req.params.id) }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        res.json(doc);
    });
})

// route to insert the document data into collection
app.post('/api/products', (req, res, next) => {
    db.products.insert(req.body, (err, doc) => {
        if (err) {
            res.send(err)
        };
        res.json(doc);
    });
})

// route to update the document data using ID
app.put('/api/products/:id', (req, res, next) => {
    db.products.findAndModify({
        query: { _id: mongo.ObjectId(req.params.id) },
        update: {
            $set: {
                name: req.body.name,
                category: req.body.category
            }
        },
        new: true
    }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        res.json(doc);
    })
})
