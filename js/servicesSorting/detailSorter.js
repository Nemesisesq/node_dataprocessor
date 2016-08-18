/**
 * Created by Nem on 7/1/16.
 */

var _ = require('lodash');
var utils = require('./utils');
var async = require('async');
var sortObj = require('sort-object');

function interceptor(obj) {
    // console.log(obj)
    obj

}


var processOtaService = function (elem) {
    var elemCopy = _.cloneDeep(elem);

    elemCopy.name = 'OTA';
    delete elemCopy['id'];
    delete elemCopy['$$hashKey'];

    elemCopy.source = 'ota';
    return elemCopy;
};

module.exports = {

    scheduleNetworkSuggestions: function (sched) {

        var collection = ['OTA', 'Sling Blue', 'Sling Orange', 'Sling Blue Orange', 'Sony Vue Slim', 'Sony Vue Core', 'Sony Vue Elite'];

        collection = _.map(collection, function (elem) {
            return {
                source: _.snakeCase(elem),
                display_name: elem
            }
        })

        sched.data = _.map(sched.data, function (elem) {
            elem.suggestion = []
            _.forEach(collection, function (serv) {
                var camel_chan = _.camelCase(serv.display_name);

                if (_.some(elem.result_time.network, function (elem) {
                        return _.includes(utils[camel_chan], elem) || _.includes(utils[camel_chan], _.lowerCase(elem))

                    })) {

                    if (_.some(elem.suggestion, function (d) {
                            if (/sling/i.test(d.source) && /sling/i.test(camel_chan)) {
                                return true
                            }

                            if (/vue/i.test(d.source) && /vue/i.test(camel_chan)) {
                                return true
                            }

                        })) {

                    } else {
                        elem.suggestion.push(serv)

                    }

                }
            })

            return elem
        });

        return sched

    },

    viewingWindows: function (cs) {
        var res
        async.waterfall([
            async.apply(this.detailSources, cs),
            this.sonyVueProcessor
        ], function (err, result) {
            res = result
        })
        return res
    },

    getSportsServices: function (cs) {
        async.waterfall([
            async.apply(this.transformSportsNetworks, cs),
            this.sonyVueProcessor,
        ], function (err, result) {
            res = result
        })
        return res


    },

    transformSportsNetworks: function (cs, callback) {
        var res = {live: []}
        //
        // var jsonString = cs.json_data.replace(/'/g, '"');
        // jsonString = utils.cleanString(jsonString);
        // cs.json_data = JSON.parse(jsonString)

        cs.json_data.network_list = utils.getSportsServices(cs)

        callback(null, res, cs)
    },


    sonyVueProcessor: function (obj, cs, callback) {

        var collection = ['Sling Blue', 'Sling Orange', 'Sling Blue Orange', 'Sony Vue Slim', 'Sony Vue Core', 'Sony Vue Elite'];

        collection = _.map(collection, function (elem) {
            return {
                source: _.snakeCase(elem),
                display_name: elem
            }
        })
        _.forEach(collection, function (chan) {
            var camel_chan = _.camelCase(chan.display_name)
            utils.checkShowCoverageByTier(cs, utils[camel_chan]) && obj.live.push(chan)
        })

        callback(null, obj)
    },

    detailSources: function (cs, callback) {

        if (cs.guidebox_data != undefined) {


            var x = _(cs.channel)
                .map(function (elem) {
                    try {
                        elem.source = elem.guidebox_data.short_name
                    } catch (e) {
                        console.log(e)
                    }
                    return elem
                })
                .concat(cs.guidebox_data.sources.web.episodes.all_sources, cs.guidebox_data.sources.ios.episodes.all_sources, cs.guidebox_data.detail.channels)
                .tap(function (o) {
                    o
                })
                .map(function (elem) {
                    _.forEach(elem.channel, function (c) {

                        c = utils.fixGuideboxData(c, elem);
                    });

                    if (elem.guidebox_data != undefined) {
                        elem.source = elem.guidebox_data.short_name
                    }
                    return elem
                })
                .map(function (elem) {
                    if (elem.source == 'hulu_free') {
                        elem.source = 'hulu_plus';
                        return elem
                    }

                    if (elem.source == 'starz_tveverywhere') {
                        elem.source = 'starz'
                    }

                    if (elem.source == 'showtime_subscription') {
                        elem.source = 'showtime'
                    }

                    return elem;
                })
                .thru(function (services) {
                    if (utils.checkForHuluWithShowtime(services)) {
                        services = utils.removeHuluIfShowtimeContent(services)
                    }

                    return services
                })
                .map(function (elem) {
                    if (elem.source == undefined) {

                        if (elem.hasOwnProperty('display_name')) {
                            elem.source = elem.display_name.toLowerCase()
                        }
                        if (elem.hasOwnProperty('name')) {
                            elem.source = elem.name.toLowerCase()
                        }

                    }

                    return elem

                })
                .uniqBy('source')
                .uniqBy(function (elem) {
                    if (elem.display_name) {
                        return elem.display_name

                    } else {
                        return elem.name
                    }
                })
                .tap(utils.interceptor)
                .groupBy(function (service) {
                    if (_.includes(utils.liveServices, service.source)) {
                        return 'live'
                    }
                    // if (service.is_on_sling || service.on_sling || _.includes(utils.slingChannels, service.display_name)) {
                    //     return 'live'
                    // }
                    if (_.includes(utils.onDemandServices, service.source)) {
                        return 'on_demand'
                    }
                    if (_.includes(utils.bingeServices, service.source)) {
                        return 'binge'
                    }
                    if (_.includes(utils.payPerServices, service.source)) {
                        return 'pay_per_view'
                    }

                    return 'misc'
                })
                .tap(utils.interceptor)
                .thru(function (services) {

                        _.forEach(services.misc, function (service) {
                            if (service.source == 'hbo_now') {
                                services.live.push(service);
                                services.on_demand.push(service);
                                services.binge.push(service);
                            }
                            else if (service.source == 'showtime_subscription') {
                                services.on_demand.push(service);
                                services.binge.push(service);
                                services.live.push(service);
                            }

                        });
                        if (_.some(services.on_demand, ['source', 'starz'])) {

                            if (services.binge == undefined) {
                                services.binge = []
                            }
                            services.binge.push(_.takeWhile(services.on_demand, {'source': 'starz'})[0]);

                        }

                        if (services.live) {
                            var newLiveServices = _.chain(services.live)
                                .map(function (elem) {
                                    // debugger
                                    var elemCopy;

                                    if (elem.hasOwnProperty('guidebox_data') && elem.guidebox_data.is_over_the_air) {


                                        elemCopy = processOtaService(elem);


                                        if (elem.source != 'nbc' && elem.source != 'cbs' && elem.source != 'showtime') {

                                            return elemCopy
                                        }
                                        services.live.push(elemCopy)
                                    }

                                    return elem
                                })
                                .map(function (elem) {


                                    if (elem.is_over_the_air || _.includes(utils.otaServices, elem.source)) {
                                        elemCopy = processOtaService(elem);

                                        if (elem.source != 'nbc' && elem.source != 'cbs' && elem.source != 'showtime') {
                                            return elemCopy
                                        }
                                        services.live.push(elemCopy)
                                    }

                                    return elem

                                })
                                // .map(function (elem) {
                                //
                                //
                                //     if (elem.is_on_sling ||
                                //         elem.on_sling ||
                                //         _.includes(utils.slingChannels, elem.display_name) ||
                                //         _.includes(utils.slingChannels, elem.name)) {
                                //         // var elemCopy = _.cloneDeep(elem);
                                //
                                //         elem.name = 'Sling';
                                //         elem.display_name = 'Sling';
                                //         delete elem['id'];
                                //         delete elem['$$hashKey'];
                                //
                                //         elem.source = 'sling_tv';
                                //
                                //         // services.live.push(elemCopy)
                                //
                                //     }
                                //     return elem
                                // })
                                .map(function (elem) {


                                    if (elem.source == "cbs") {


                                        if (!services.binge) {
                                            services.binge = []
                                        }
                                        services.binge.push(elem);

                                        if (!services.on_demand) {
                                            services.on_demand = []
                                        }
                                        services.on_demand.push(elem)
                                    }

                                    return elem
                                })
                                .map(function (elem) {

                                    if (elem.source == "hbo_now") {

                                        if (!services.binge) {
                                            services.binge = []
                                        }
                                        services.binge.push(elem);

                                        if (!services.on_demand) {
                                            services.on_demand = []
                                        }

                                        services.on_demand.push(elem)


                                    }
                                    return elem
                                })
                                .map(function (elem) {

                                    if (elem.source == "showtime_subscription" || elem.source == "showtime") {

                                        if (!services.binge) {
                                            services.binge = []
                                        }
                                        services.binge.push(elem);

                                        if (!services.on_demand) {
                                            services.on_demand = []
                                        }

                                        services.on_demand.push(elem)

                                    }
                                    return elem
                                })
                                .value();

                            services.live = newLiveServices;
                        }

                        _.forEach(services.live, function (elem) {

                            if (elem.source == 'cbs') {
                                services.live.push({name: 'OTA', source: 'ota'})
                            }
                        });


                        if (cs.on_netflix) {
                            if (!services.hasOwnProperty('binge')) {
                                services.binge = []

                            }

                            var netflix_channel = _.some(services.binge, ['source', 'netflix']);

                            if (!netflix_channel) {
                                services.binge.push({source: 'netflix'})
                            }
                        }


                        return services
                    }
                )
                .thru(function (services) {
                    services.live = _.uniqBy(services.live, 'source');
                    return services
                })
                .thru(function (services) {

                    var nbc = _.takeWhile(services.live, function (item) {
                        return item.source == 'nbc';
                    });

                    if (nbc.length > 0) {
                        if (services.on_demand == undefined) {
                            services.on_demand = nbc
                        } else {

                            services.on_demand = _.concat(services.on_demand, nbc)
                        }
                        if (!_.some(services.live, ['source', 'ota '])) {
                            elemCopy = processOtaService(nbc[0]);

                            services.live = [elemCopy];
                        }
                    }


                    if (!Object.keys) Object.prototype.keys = function (o) {
                        if (o !== Object(o))
                            throw new TypeError('Object.keys called on a non-object');
                        var k = [], p;
                        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
                        return k;
                    };

                    services.sortedServices = _.filter(['live', 'on_demand', 'binge', 'pay_per_view'], function (elem) {
                        return services[elem]
                    })

                    return services


                })
                .value();
        }
        callback(null, x, cs)

        return x
    }

};