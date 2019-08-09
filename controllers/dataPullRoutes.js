// API (APPLICATION PROGRAMMING INTERFACE) FOR JSON RESPONSES //////////////////////////////////////

const express = require('express')
const router = express.Router();

//****************************************************
const dbImport = require('../config/database.js')
let mongo = dbImport.mongo
let databaseName = dbImport.databaseName
let entriesCollection = dbImport.entriesCollection
let MongoClient = dbImport.MongoClient
let url = dbImport.url
//****************************************************

//Find all entries
router.post('/api/entries/all', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(entriesCollection).find({}).sort({ [req.body.sortColumn]: parseInt(req.body.sortOrder) }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return res.json({
                data: result
            })
        });
    })
});

//Find all applications where an interview is upcoming
router.post('/api/entries/outstanding', (req, res) => {
    console.log('outstanding routes hit')
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(entriesCollection).find({ closure: 'Outstanding' }).sort({ [req.body.sortColumn]: parseInt(req.body.sortOrder) }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return res.json({
                data: result
            })
        });
    })
});

//Find all applications where an interview is upcoming
router.post('/api/entries/interviews', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(entriesCollection).find({ progress: 'Interview Offered', closure: 'Outstanding' }).sort({ [req.body.sortColumn]: parseInt(req.body.sortOrder)  }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return res.json({
                data: result
            })
        });
    })
});

//Find all concluded applications
router.post('/api/entries/concluded', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(entriesCollection).find({ closure: { $ne: 'Outstanding' } }).sort({ [req.body.sortColumn]: parseInt(req.body.sortOrder)  }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return res.json({
                data: result
            })
        });
    })
});

//Find all applications that are marked as never responded
router.post('/api/entries/neverresponded', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(entriesCollection).find({ closure: 'Never Responded' }).sort({ [req.body.sortColumn]: parseInt(req.body.sortOrder)  }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return res.json({
                data: result
            })
        });
    })
});

module.exports = router;
