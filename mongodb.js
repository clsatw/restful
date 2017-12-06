const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

// Connection URI
const url = 'mongodb://www.ajoan.com:27017/edx-course-db'
let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

const insertDocuments = (db, callback) => {
    // Get reference to edx-course-docs collection
    const collection = db.collection('edx-course-students')
    // Insert 3 documents
    collection.insert([
        { name: 'Bob' }, { name: 'John' }, { name: 'Peter' } // 3 documents
    ], (error, result) => {
        if (error) {
            console.error(`cannot insert ${error}`);
            return process.exit(1);
        }
        console.log(result.result.n) // will be 3
        console.log(result.ops.length) // will be 3
        console.log('Inserted 3 documents into the edx-course-students collection')
        callback(result)
    })
}

const updateDocument = (db, callback) => {
    // Get the edx-course-students collection
    var collection = db.collection('edx-course-students')
    // Update document where a is 2, set b equal to 1
    const name = 'Peter'
    collection.update({ name: name }, { $set: { grade: 'A' } }, (error, result) => {
        if (error) return process.exit(1)
        console.log(result.result.n) // will be 1
        console.log(`Updated the student document where name = ${name}`)
        callback(result)
    })
}

const removeDocument = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('edx-course-students')
    // Insert some documents
    const name = 'Bob'
    collection.remove({ name: name }, (error, result) => {
        if (error) return process.exit(1)
        console.log(result.result.n) // will be 1
        console.log(`Removed the document where name = ${name}`)
        callback(result)
    })
}

const findDocuments = (db, callback) => {
    // Get the documents collection
    var collection = db.collection('edx-course-students')
    // Find some documents
    collection.find({}).toArray((error, docs) => {
        if (error) return process.exit(1)
        console.log(2, docs.length) // will be 2 because we removed one document
        console.log(`Found the following documents:`)
        console.dir(docs)
        callback(docs)
    })
}

// Use connect method to connect to the Server
MongoClient.connect(url, (err, db) => {
    if (err) return process.exit(1)
    console.log('Kudos. Connected successfully to server')
    /* Perform queries, for test purpose
    insertDocuments(db, () => {
        updateDocument(db, () => {
            removeDocument(db, () => {
                findDocuments(db, () => {
                    db.close()
                })
            })
        })
    })
    */
    app.get('/accounts', (req, res, next) => {
        db.collection('accounts')
            .find({}, { sort: { _id: -1 } })
            .toArray((error, accounts) => {
                if (error) return next(error)
                res.send(accounts)
            })
    })
    app.get('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
            .find({_id: mongodb.ObjectID(req.params.id)}, { sort: { _id: -1 } })
            .toArray((error, accounts) => {
                if (error) return next(error)
                res.send(accounts)
            })
    })
    
    app.post('/accounts', (req, res, next) => {
        let newAccount = req.body
        db.collection('accounts').insert(newAccount, (error, results) => {
            if (error) return next(error)
            res.send(results)
        })
    })

    app.put('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
            .update({ _id: mongodb.ObjectID(req.params.id) },
            { $set: req.body },
            (error, results) => {
                if (error) return next(error)
                res.send(results)
            })
    })

    app.delete('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
            .remove({ _id: mongodb.ObjectID(req.params.id) }, (error, results) => {
                if (error) return next(error)
                res.send(results)
            })
    })
    // errro handing will give a nice error msg page. you should write your custom one.
    app.use(errorhandler());
    app.listen(3000)
})