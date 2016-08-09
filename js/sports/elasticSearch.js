/**
 * Created by Nem on 8/8/16.
 */
var MongoClient = require('mongodb')
var elasticsearch = require('elasticsearch');
var q = require('q')

var Bodybuilder = require('bodybuilder')
var body = new Bodybuilder() // A builder instance.
// body.query('match', 'message', 'this is a test')
// body.build() // Build 1.x DSL
// body.build('v2') // Bui


var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

client.ping({
    requestTimeout: 30000,

    // undocumented params are appended to the query string
    hello: "elasticsearch"
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

function addDoc(doc) {
    client.index({
        index: 'myindex',
        type: 'mytype',
        id: doc.id,
        body: doc,

    }, function (error, response) {

        console.log(response)

    });
}

function search(q) {
    client.search({
        index: 'myindex',
        body: q
    }, function (error, response) {
        console.log(response)
    })
}

var url = 'mongodb://localhost:27017/sports';
MongoClient.connect(url)
    .then(function (db) {
        // assert.equal(null, err);
        console.log("Connected correctly to server.");

        return db.collection('Y2000')


    })
    .then(function (col) {
        col.find({})
            .toArray(function (err, docs) {
                // console.log(docs)
                docs.forEach(function (doc) {
                    delete doc['_id']
                    // addDoc(doc)
                })
            })

    })


// search('Wisconsin')

var x = body.query('fuzzy', 'college_name', 'Memphi*').build('v2')

console.log(x)

search(x)