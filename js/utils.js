/**
 * Created by Nem on 7/1/16.
 */

var _ = require('lodash');

module.exports = {
    liveServices: ['cw',  'pbs', 'sling', 'cbs', 'hgtv', 'nbc', 'abc', 'thecw', 'showtime_subscription', 'hbo_now', 'showtime', 'fox', 'fox_tveverywhere'],
    onDemandServices: ['acorntv', 'cwseed', 'hulu_plus', 'hulu', 'hulu_free', 'nbc', 'starz', 'showtime_subscription', 'crackle'],
    bingeServices: ['netflix', 'amazon_prime', 'seeso', 'tubi_tv', 'starz', 'starz_tveverywhere', 'showtime_subscription'],
    payPerServices: ['google_play', 'itunes', 'amazon_buy', 'youtube_purchase', 'vudu'],
    slingChannels: ['ESPN', 'ESPN2', 'AMC', 'Food Network', 'A&E', 'History', 'TNT', 'El Rey', 'HGTV', 'IFC',
        'Disney Channel', 'Polaris +', 'Maker', 'TBS', 'Travel Channel', 'Adult Swim', 'CNN', 'H2',
        'Cartoon Network', "Comedy Central", 'ABC Family', 'Lifetime', 'Galavision', 'Bloomberg Television', 'Freeform', 'VICELAND'],
    interceptor: function (obj) {
        // console.log(obj)
        obj
    },

    checkForHuluWithShowtime: function (services) {
        return _.some(services, function (elem) {
            try {

                return elem.source == "hulu_with_showtime";
            }

            catch (e) {

                return false
            }
        });
    },

    removeHuluIfShowtimeContent: function (services) {
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
    },

    fixGuideboxData: function (c, elem) {
        if (typeof c.guidebox_data == 'string') {
            var jsonString = c.guidebox_data.replace(/'/g, '"');
            jsonString = this.cleanString(jsonString);
            c.guidebox_data = JSON.parse(jsonString)
        }

        if (elem.source == undefined) {
            c.source = c.guidebox_data.source
        }

        return c

    },
    cleanString: function (s) {
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
};