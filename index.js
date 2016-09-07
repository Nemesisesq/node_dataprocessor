var ss = require('./js/servicesSorting/sorter.js');
var ds = require('./js/servicesSorting/detailSorter');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var sling = require('./js/servicesSorting/slingParser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))

app.use(cors({
    allowedOrigins: [
        'localhost', 'herokuapp.com', 'streamsavvy.tv'
    ]
}));

app.use(morgan('combined'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', function (request, response) {
    response.render('pages/index');
});

app.post('/service_list', function (request, response) {
    var body = request.body;
    var res = ss.servicePanelList(body);
    response.send(res)
});

app.post('/checkout_list', function (request, response) {
    var body = request.body;
    var res = ss.checkoutList(body);
    response.send(res)
});

app.post('/detail_sources', function (request, response) {
    var body = request.body;
    var res = ""
    if (body.guidebox_data) {
        res = ds.viewingWindows(body);
    }

    if (body.category){
        res = ds.getSportsServices(body)
    }
    response.send(res)
});

app.post('/sling_vue', function (request, response) {
    var body = request.body;
    var res = sling.process(body);
    response.send(res)

})

app.post('/sched_suggestion', function (request, response) {
    var body = request.body;
    var res = ds.scheduleNetworkSuggestions(body);
    response.send(res)
})

app.post('/guide', function(request, response){
    var body = request.body;
    var res = sling.processGuideChan(body)
    response.send(res)
})


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


