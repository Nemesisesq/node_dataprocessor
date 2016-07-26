/**
 * Created by Nem on 7/21/16.
 */

var _ = require('lodash');
var async = require('async');
var utils = require('./utils');


module.exports = {

    process: function (pkg) {

        var res;

        async.waterfall([
            async.apply(this.orange, [], pkg.data.content),
            this.blue,
            this.orange_blue,
            this.vueSlim,
            this.vueCore,
            this.vueElite,
            this.normalizeServices,
        ], function end(err, result) {
            res = result
        })

        return res

    },

    normalizeServices: function (sorted_array, content, callback) {
        sorted_array = _.map(sorted_array, function (elem) {
            elem.chan = {
                source: _.snakeCase(elem.chan),
                display_name: elem.chan
            }

            return elem
        })

        sorted_array = _.filter(sorted_array, function(elem){
            return elem.shows.length > 0
        })

        callback(null, sorted_array, content)
    },

    orange: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sling Orange');

        callback(null, sorted_array, content)

    },

    blue: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sling Blue');

        callback(null, sorted_array, content)

    },

    orange_blue: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sling Blue Orange');

        callback(null, sorted_array, content)

    },

    vueSlim: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sony Vue Slim');

        callback(null, sorted_array, content)

    },

    vueCore: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sony Vue Core');

        callback(null, sorted_array, content)

    },

    vueElite: function (sorted_array, content, callback) {

        sorted_array = utils.processContent(content, sorted_array, 'Sony Vue Elite');

        callback(null, sorted_array, content)

    },
}
