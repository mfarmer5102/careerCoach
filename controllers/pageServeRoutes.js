// HANDELBARS TEMPLATE SERVING /////////////////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router();
var uuid = require('uuid');
const uuidv4 = require('uuid/v4');

//****************************************************
const dbImport = require('../config/database.js')
let mongo = dbImport.mongo
let databaseName = dbImport.databaseName
let entriesCollection = dbImport.entriesCollection
let MongoClient = dbImport.MongoClient
let url = dbImport.url
//****************************************************

router.get('/', (req, res) => {
    res.render('login')
});

router.get('/createaccount_prompt', (req, res) => {
    res.render('createaccount')
});

router.post('/createaccount_process', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        console.log(req.body)
        var myobj = {username: req.body.username, password: req.body.password, uuid: uuidv4()};
        dbo.collection('users').insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            console.log(myobj)
            db.close();
        });
    });
});

router.post('/processlogin', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        var query = { username: req.body.username, password: req.body.password };
        console.log(query)
        dbo.collection('users').find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result)
            res.json(result)
        });
    });
});

router.get('/viewall', (req, res) => {
    res.render('viewAll')
});

router.get('/add_prompt', (req, res) => {
    res.render('addPrompt')
});

module.exports = router;