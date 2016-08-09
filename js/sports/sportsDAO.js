/**
 * Created by Nem on 8/8/16.
 */

var MongoClient = require('mongodb');
var fs = require('fs');
var assert = require('assert');
// var csv = require('csv');
var parse = require('csv-parse');
var async = require('async')
var _ = require("lodash")

var url = 'mongodb://localhost:27017/sports';
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});

var Converter = require("csvtojson").Converter;
var converter = new Converter({});


var csvArray = []
//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonArray) {
    // console.log(jsonArray); //here is your result jsonarray
    console.log(jsonArray)

    jsonArray = _.map(jsonArray, function(elem){
        elem.tag_list = _.compact(elem.tag_list.split(","))
        elem.network_list = _.compact(elem.network_list.split(","))
        return elem
    })

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");

        db.collection('Y2000')
            .insertMany(jsonArray)
            .then(function (r) {
                console.log(r)
            })
        db.close();
    });

})


//read from file
fs.createReadStream("../../college_football_data.csv")
    .pipe(converter)

