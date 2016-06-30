/**
 * Created by Nem on 6/29/16.
 */
var _ = require('lodash');
var async = require('async');

var liveServices = ['cw', 'pbs', 'sling', 'cbs', 'nbc', 'abc', 'thecw', 'showtime_subscription', 'hbo_now', 'showtime', 'fox', 'fox_tveverywhere'];
var onDemandServices = ['acorntv', 'cwseed', 'hulu_plus', 'hulu', 'hulu_free', 'nbc', 'starz', 'showtime_subscription', 'crackle'];
var bingeServices = ['netflix', 'amazon_prime', 'seeso', 'tubi_tv', 'starz', 'starz_tveverywhere', 'showtime_subscription'];
var payPerServices = ['google_play', 'itunes', 'amazon_buy', 'youtube_purchase', 'vudu'];

function interceptor(obj) {
    // console.log(obj)
    obj

}

function check_if_on_sling(obj) {

    if (obj.chan.on_sling) {
        return true
    } else if (obj.chan.is_on_sling) {
        return true
    } else {
        return false
    }

}

function checkForHuluWithShowtime(services) {
    return _.some(services, function (elem) {
        try {

            return elem.source == "hulu_with_showtime";
        }

        catch (e) {

            return false
        }
    });
}

function removeHuluIfShowtimeContent(services) {
    return _.filter(services, function (elem) {
        if (elem.source == "hulu_with_showtime") {
            return false
        }

        if (elem.source == "showtime_free") {
            return false
        }

        if (elem.source == "hulu_free") {
            return false
        }

        if (elem.source == "hulu_plus") {
            return false
        }

        if (elem.display_name == "Showtime Anytime") {
            return false
        }

        return true
    });
}


function cleanString(s) {
    s = s.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        .replace(RegExp(/None/g), '"false"');

    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u0019]+/g, "");


    return s
}

module.exports = {

    servicePanelList: function (pkg) {
        var res
        async.waterfall([
            async.apply(this.genList, pkg),
            this.createlist,
            this.consolidatePpv
        ], function end(err, result) {
            res = result
        });
        // var genList = this.genList()
        return res
    },

    checkoutList: function (pkg) {
        var res
        async.waterfall([
            async.apply(this.genList, pkg),
            this.createlist,
        ], function end(err, result){
            res = result
        })
        return res
    },


    genList: function getBase(ssPackage, callback) {
        var list = _.chain(ssPackage.data.content)
            .map(function (elem) {
                _.forEach(elem.channel, function (c) {

                    if (typeof c.guidebox_data == 'string') {
                        var jsonString = c.guidebox_data.replace(/'/g, '"');
                        jsonString = cleanString(jsonString)
                        c.guidebox_data = JSON.parse(jsonString)
                    }

                    if (elem.source == undefined) {
                        c.source = c.guidebox_data.source
                    }
                })
                var list
                elem.guidebox_data.sources == undefined ? list = elem.channel : list = _.concat(elem.channel, elem.guidebox_data.sources.web.episodes.all_sources, elem.guidebox_data.sources.ios.episodes.all_sources);
                return list
            })
            .tap(interceptor)
            .flatten()
            .uniqBy('source')
            .thru(function (services) {
                if (checkForHuluWithShowtime(services)) {
                    services = removeHuluIfShowtimeContent(services)
                }

                return services
            })
            .uniqBy(function (elem) {
                if (elem.display_name) {
                    return elem.display_name
                } else {
                    return elem.name
                }
            })
            .tap(interceptor)
            .map(function (elem) {
                if (elem.source == 'hulu_free') {
                    elem.source = 'hulu_plus';
                    elem.id = 10
                    return elem
                }

                return elem;
            })
            .value()
        callback(null, list, ssPackage)
    },
    createlist: function (list, ssPackage, callback) {



        // var genList = this.genList(ssPackage);

        var res = _.chain(list, ssPackage)
            .thru(function (list) {
                if (_.some(ssPackage.data.content, 'on_netflix')) {
                    if (!_.some(list, ['source', 'netflix'])) {
                        list.push({display_name: 'Netflix', source: 'netflix'})
                    }
                }

                return list

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
            .map(function (elem) {
                var o = {chan: elem}
                o.shows = _.filter(ssPackage.data.content, function (show) {
                    if (show.on_netflix && elem.source == 'netflix') {
                        return true
                    }
                    if (show.guidebox_data.sources) {
                        var source_check = _.some(show.guidebox_data.sources.web.episodes.all_sources, function (show) {
                            var showRe = new RegExp(show.source)
                            var elemRe = new RegExp(elem.source)

                            return showRe.test(elem.source) || elemRe.test(show.source)


                        })
                    } else {
                        source_check = false
                    }


                    var url_check = _.some(show.channel, ['url', elem.url]);
                    return url_check || source_check
                })

                if (o.chan.guidebox_data) {
                    if (o.chan.guidebox_data.is_over_the_air) {
                        o.chan.is_over_the_air = o.chan.guidebox_data.is_over_the_air;
                    }
                }

                return o

            })
            .filter(function (elem) {
                return elem.chan.source != 'misc_shows' && elem.chan.display_name != "HBO GO" && elem.chan.source != 'mtv' && elem.chan.source != 'showtime_free'
            })
            .groupBy(function (elem) {
                if (elem.chan.is_over_the_air) {
                    return 'ota'
                }
                if (check_if_on_sling(elem)) {
                    return 'sling'
                }

                if (_.includes(payPerServices, elem.chan.source)) {
                    return 'ppv'

                }

                else {
                    return 'not_ota'
                }
            })
            .thru(function (list) {

                if (_.some(list.ota, function (item) {
                        return item.chan.source == 'nbc'
                    })) {
                    var nbc = _.chain(list.ota)
                        .takeWhile(function (item) {
                            return item.chan.source == 'nbc'
                        })
                        .cloneDeep()
                        .value()
                    if (list.not_ota == undefined) {
                        list.not_ota = nbc
                    } else {
                        list.not_ota = _.concat(list.not_ota, nbc)
                    }
                }

                var showsOta = _.map(list.ota, function (elem) {
                    return elem.shows
                })

                var showsSling = _.map(list.sling, function (elem) {
                    return elem.shows
                })


                if (list.ota) {
                    if (list.ota.length > 1) {

                        list.ota[0].shows = _.uniqBy(_.flatten(showsOta), 'url');
                        list.ota = [list.ota[0]];
                        list.ota[0].chan.source = 'ota';
                    } else {
                        list.ota[0].chan.source = 'ota';

                    }
                }

                if (list.sling) {
                    if (list.sling.length > 1) {

                        list.sling[0].shows = _.uniqBy(_.flatten(showsSling), 'url');
                        list.sling = [list.sling[0]];
                        list.sling[0].chan.source = 'sling_tv';
                    } else {
                        list.sling[0].chan.source = 'sling_tv';

                    }
                }

                return list

            })
            .tap(interceptor)
            .value();

        callback(null, res)
    },

    consolidatePpv: function (list, callback) {
        var showsPpv = _.map(list.ppv, function (elem) {
            return elem.shows
        })

        if (list.ppv && list.ppv.length > 1) {
            list.ppv[0].shows = _.uniqBy(_.flatten(showsPpv), 'url');
            list.ppv = [list.ppv[0]];
        }
        callback(null, list)
    }

}