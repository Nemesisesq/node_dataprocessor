/**
 * Created by Nem on 7/1/16.
 */

var _ = require('lodash');

module.exports = {
    liveServices: ['cw', 'pbs', 'sling', 'cbs', 'hgtv', 'nbc', 'abc', 'thecw', 'showtime_subscription', 'hbo_now', 'showtime', 'fox', 'fox_tveverywhere'],
    otaServices: ['cw', 'pbs', 'cbs', 'nbc', 'abc', 'thecw', 'fox', 'fox_tveverywhere'],
    onDemandServices: ['acorntv', 'cwseed', 'hulu_plus', 'hulu', 'hulu_free', 'nbc', 'starz', 'showtime_subscription', 'crackle'],
    bingeServices: ['netflix', 'amazon_prime', 'seeso', 'tubi_tv', 'starz', 'starz_tveverywhere', 'showtime_subscription'],
    payPerServices: ['google_play', 'itunes', 'amazon_buy', 'youtube_purchase', 'vudu'],
    slingChannels: ['ESPN', 'ESPN2', 'AMC', 'Food Network', 'A&E', 'History', 'TNT', 'El Rey', 'HGTV', 'IFC',
        'Disney Channel', 'Polaris +', 'Maker', 'TBS', 'Travel Channel', 'Adult Swim', 'CNN', 'H2',
        'Cartoon Network', "Comedy Central", 'ABC Family', 'Lifetime', 'Galavision', 'Bloomberg Television', 'Freeform', 'VICELAND'],

    slingOrange: ['A&E', 'Adult Swim', 'AMC', 'BBC America', 'Bloomberg TV', 'Cartoon Network', 'CNN', 'Comedy Central', 'Disney Channel', 'El Rey Network', 'ESPN', 'ESPN 2', 'Flama', 'Food Network', 'Freeform', 'Galavision', 'HGTV', 'History Channel', 'IFC', 'Lifetime', 'Local Now', 'Maker', 'Newsy', 'Polaris +', 'TBS', 'TNT', 'Travel Channel', 'Viceland'],
    slingBlue: ['A&E', 'Adult Swim', 'AMC', 'BBC America', 'BET', 'Bloomberg TV', 'Bravo', 'Cartoon Network', 'CNN', 'Comedy Central', 'CSN', 'El Rey Network', 'Flama', 'Food Network', 'Fox', 'Fox Sports', 'FS1', 'FS2', 'FX', 'FXX', 'Galavision', 'HGTV', 'History Channel', 'IFC', 'Lifetime', 'Local Now', 'Maker', 'Nat Geo Wild', 'National Geographic', 'NBC', 'NBCSN', 'Newsy', 'Nick Jr', 'Polaris +', 'Syfy', 'TBS', 'TNT', 'Travel Channel', 'Tru TV', 'Uni Mas', 'Univision', 'USA', 'Viceland'],
    slingBlueOrange: ['A&E', 'Adult Swim', 'AMC', 'BBC America', 'Bloomberg TV', 'Cartoon Network', 'CNN', 'Comedy Central', 'Disney Channel', 'El Rey Network', 'ESPN', 'ESPN 2', 'Flama', 'Food Network', 'Freeform', 'Galavision', 'HGTV', 'History Channel', 'IFC', 'Lifetime', 'Local Now', 'Maker', 'Newsy', 'Polaris +', 'TBS', 'TNT', 'Travel Channel', 'Viceland', 'BET', 'Bravo', 'CSN', 'Fox', 'Fox Sports', 'FS1', 'FS2', 'FX', 'FXX', 'Nat Geo Wild', 'National Geographic', 'NBC', 'NBCSN', 'Nick Jr', 'Syfy', 'Tru TV', 'Uni Mas', 'Univision', 'USA'],
    sonyVueSlim: ['AMC', 'Animal Planet', 'BET', 'Bravo', 'Cartoon Network', 'CMT', 'CNBC', 'CNN', 'Comedy Central', 'Destination America', 'Discovery', 'Discovery Family', 'Disney Channel', 'Disney Junior', 'Disney XD', 'DIY Network', 'E!', 'ESPN', 'ESPN2', 'Esquire Network', 'Food Network', 'Fox Business', 'Fox News', 'Freeform', 'FS1', 'FS2', 'FX', 'FXX', 'HGTV', 'HLN', 'Investigation Discovery', 'MSNBC', 'MTV', 'MTV2', 'National Geographic', 'NBCSN', 'Nick Jr.', 'Nickelodeon', 'Nick Toons', 'OWN', 'Oxygen', 'Pop', 'Science', 'Spike', 'Syfy', 'TBS', 'TLC', 'TNT', 'Travel Channel', 'TruTV', 'TV Land', 'USA'],
    sonyVueCore: ['AMC', 'Animal Planet', 'BET', 'Bravo', 'Cartoon Network', 'CMT', 'CNBC', 'CNN', 'Comedy Central', 'Destination America', 'Discovery', 'Discovery Family', 'Disney Channel', 'Disney Junior', 'Disney XD', 'DIY Network', 'E!', 'ESPN', 'ESPN2', 'Esquire Network', 'Food Network', 'Fox Business', 'Fox News', 'Freeform', 'FS1', 'FS2', 'FX', 'FXX', 'HGTV', 'HLN', 'Investigation Discovery', 'MSNBC', 'MTV', 'MTV2', 'National Geographic', 'NBCSN', 'Nick Jr.', 'Nickelodeon', 'Nick Toons', 'OWN', 'Oxygen', 'Pop', 'Science', 'Spike', 'Syfy', 'TBS', 'TLC', 'TNT', 'Travel Channel', 'TruTV', 'TV Land', 'USA', 'VH1', 'WeTV', 'Bein Sports', 'ESPNews', 'ESPN U', 'Fox Sports Networks', 'Golf Channel', 'IFC', 'SEC Network', 'Sundance TV', 'Turner Classic Movies', 'Telemundo'],
    sonyVueElite: ['AMC', 'Animal Planet', 'BET', 'Bravo', 'Cartoon Network', 'CMT', 'CNBC', 'CNN', 'Comedy Central', 'Destination America', 'Discovery', 'Discovery Family', 'Disney Channel', 'Disney Junior', 'Disney XD', 'DIY Network', 'E!', 'ESPN', 'ESPN2', 'Esquire Network', 'Food Network', 'Fox Business', 'Fox News', 'Freeform', 'FS1', 'FS2', 'FX', 'FXX', 'HGTV', 'HLN', 'Investigation Discovery', 'MSNBC', 'MTV', 'MTV2', 'National Geographic', 'NBCSN', 'Nick Jr.', 'Nickelodeon', 'Nick Toons', 'OWN', 'Oxygen', 'Pop', 'Science', 'Spike', 'Syfy', 'TBS', 'TLC', 'TNT', 'Travel Channel', 'TruTV', 'TV Land', 'USA', 'VH1', 'WeTV', 'Bein Sports', 'ESPNews', 'ESPN U', 'Fox Sports Networks', 'Golf Channel', 'IFC', 'SEC Network', 'Sundance TV', 'Turner Classic Movies', 'AHC', 'BET Gospel', 'BET Jams', 'BET Soul', 'Big Ten Network', 'Boomerang', 'Centric', 'Chiller', 'Cloo', 'CMT Music', 'CNBC World', 'Cooking Channel', 'Discovery Life', 'Epix Hits', 'Fox College Sports', 'Fusion', 'FXM', 'Hi-Yah', 'Impact', 'Logo', 'Machinima', 'MGM HD', 'MTV Hits', 'MTV Live', 'MTV U', 'Nat Geo Wild', 'One World Sports', 'Outside Television', 'Sprout', 'TeenNick', 'Universal HD', 'Velocity', 'VH1 Classic'],
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

    },

    getServices: function (elem) {
        _.forEach(elem.channel, function (c) {

            c = utils.fixGuideboxData(c, elem);
        });
        var list;
        elem.guidebox_data.sources == undefined ? list = elem.channel : list = _.concat(elem.channel, elem.guidebox_data.sources.web.episodes.all_sources, elem.guidebox_data.sources.ios.episodes.all_sources, elem.guidebox_data.detail.channels);
        return list
    }
};