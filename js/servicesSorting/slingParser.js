/**
 * Created by Nem on 7/21/16.
 */

var clj_fuzzy = require('clj-fuzzy')

var _ = require('lodash');
var async = require('async');
var utils = require('./utils');


module.exports = {

    processGuideChan: function (chan) {

        var collection = ['OTA', 'Sling Blue', 'Sling Orange', 'Sling Blue Orange', 'Sony Vue Slim', 'Sony Vue Core', 'Sony Vue Elite'];

        collection = _.map(collection, function (elem) {
            return {
                source: _.snakeCase(elem),
                display_name: elem
            }
        })

        var that = this;
        collection = _.filter(collection, function (elem) {
            return that.matchChanInList(elem, chan)
        })

        chan.streamingServices = collection;

        return chan


    },


    matchChanInList: function (elem, chan) {

        return _.some(utils[_.camelCase(elem.source)], function (e) {

            e = e.replace(/\(.\)/, "")

            return clj_fuzzy.metrics.dice(e, chan.SourceLongName) > .3 || clj_fuzzy.metrics.dice(e, chan.DisplayName) > .3

        })

    },

    process: function (pkg) {

        var res;

        async.waterfall([
            async.apply(this.orange, [], pkg.data.content),
            this.blue,
            this.orange_blue,
            this.vueSlim,
            this.vueCore,
            this.vueElite,
            async.apply(this.sports, pkg),
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

        sorted_array = _.filter(sorted_array, function (elem) {
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
    sports: function (pkg, sorted_array, content, callback) {
        var sports = pkg.data.sports;

        _.forEach(sports, function (elem) {
            sorted_array = _.map(sorted_array, function (service) {
                if (_.snakeCase(service.chan) == elem.img) {
                    service.shows.push(elem)
                }


                return service
            })

            if (elem.img == 'fubotv') {

                var fubo_service = {

                    chan: 'Fubo TV',


                    shows: [elem]
                }

                sorted_array.push(fubo_service)


            }
        })


        callback(null, sorted_array, content)


    }
}
