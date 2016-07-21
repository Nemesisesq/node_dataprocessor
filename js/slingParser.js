/**
 * Created by Nem on 7/21/16.
 */

var _ = require('lodash');
var async = require('async');
var utils = require('./utils');


var checkShowCoverageByTier = function (elem, list) {
    var show_services = utils.getServices(elem)
    show_services = _.map(show_services, function (elem) {
        return elem.name

    })

    var intersection = _.intersection(show_services, list);

    return intersection.length > 0
};
var processContent = function (content, sorted_array, chan) {
    var camel_chan = _.camelCase(chan)

    var res = _.filter(content, function (elem) {
        return checkShowCoverageByTier(elem, utils[camel_chan]);
    })

    var x = {
        chan: chan,
        shows: res
    }

    sorted_array.push(x)
};
module.exports = {

    process: function (pkg) {

        var res;

        async.waterfall([
            async.apply(this.orange, pkg.data.content),
            this.blue,
            this.orange_blue,
            this.vueSlim,
            this.vueCore,
            this.vueElite,
            function (err, result) {
                res = result
            }
        ])

        return res

    },

    orange: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sling Orange');

        callback(null, sorted_array, content)

    },

    blue: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sling Blue');

        callback(null, sorted_array, content)

    },

    orange_blue: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sling Blue Orange');

        callback(null, sorted_array, content)

    },

    vueSlim: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sony Vue Slim');

        callback(null, sorted_array, content)

    },

    vueCore: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sony Vue Core');

        callback(null, sorted_array, content)

    },

    vueElite: function (sorted_array, content, callback) {

        sorted_array = processContent(content, sorted_array, 'Sony Vue Elite');

        callback(null, sorted_array, content)

    },
}