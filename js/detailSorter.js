/**
 * Created by Nem on 7/1/16.
 */

var _ = require('lodash');
var utils = require('./utils');

function interceptor(obj) {
    // console.log(obj)
    obj

}



module.exports = {

    detailSources: function (cs) {

        if (cs.guidebox_data != undefined) {


            var x = _(cs.channel)
                .concat(cs.guidebox_data.sources.web.episodes.all_sources, cs.guidebox_data.sources.ios.episodes.all_sources)
                .tap(function(o){
                    o
                })
                .map(function (elem) {
                    _.forEach(elem.channel, function (c) {

                        c = utils.fixGuideboxData(c, elem);
                    })

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
                    if (service.is_on_sling || service.on_sling) {
                        return 'live'
                    }
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

                    })
                    if (_.some(services.on_demand, ['source', 'starz'])) {

                        if (services.binge == undefined) {
                            services.binge = []
                        }
                        services.binge.push(_.takeWhile(services.on_demand, {'source': 'starz'})[0]);

                    }

                    if (services.live) {
                        _.map(services.live, function (elem) {
                            // debugger


                            if (elem.hasOwnProperty('guidebox_data') && elem.guidebox_data.is_over_the_air) {
                                var elemCopy = _.cloneDeep(elem);

                                elemCopy.name = 'OTA';
                                delete elemCopy['id'];
                                delete elemCopy['$$hashKey'];

                                elemCopy.source = 'ota';

                                services.live.push(elemCopy)
                            }

                            if (elem.is_over_the_air || _.includes(utils.liveServices, elem.source)) {
                                var elemCopy = _.cloneDeep(elem);

                                elemCopy.name = 'OTA';
                                delete elemCopy['id'];
                                delete elemCopy['$$hashKey'];

                                elemCopy.source = 'ota';

                                services.live.push(elemCopy)
                            }

                            if (elem.is_on_sling || elem.on_sling) {
                                // var elemCopy = _.cloneDeep(elem);

                                elem.name = 'Sling';
                                delete elem['id'];
                                delete elem['$$hashKey'];

                                elem.source = 'sling_tv';

                                // services.live.push(elemCopy)


                            }

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

                            if (elem.source == "hbo_now") {

                                if (!services.binge) {
                                    services.binge = []
                                }
                                services.binge.push(elem)

                                if (!services.on_demand) {
                                    services.on_demand = []
                                }

                                services.on_demand.push(elem)
                            }

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

                            //

                            return elem

                        })
                    }

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
                })
                .thru(function (services) {
                    var nbc = _.takeWhile(services.live, function (item) {
                        return item.source == 'nbc';
                    })

                    if (nbc.length > 0) {
                        if (services.on_demand == undefined) {
                            services.on_demand = nbc
                        } else {

                            services.on_demand = _.concat(services.on_demand, nbc)
                        }
                    }

                    if (!Object.keys) Object.prototype.keys = function (o) {
                        if (o !== Object(o))
                            throw new TypeError('Object.keys called on a non-object');
                        var k = [], p;
                        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
                        return k;
                    }

                    services.sortedServices = _.sortBy(Object.keys(services), function (elem) {
                        return elem.length
                    });

                    return services


                })
                .value();
        }

        return x
    }

}