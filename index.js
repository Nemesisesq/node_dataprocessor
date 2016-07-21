var ss = require('./js/sorter.js');
var ds = require('./js/detailSorter');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var sling = require('./js/slingParser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))

app.use(cors({
    allowedOrigins :[
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

app.post('/checkout_list', function(request, response){
    var body = request.body;
    var res = ss.checkoutList(body);
    response.send(res)
});

app.post('/detail_sources', function(request, response){
    var body = request.body;
    var res = ds.detailSources(body);
    response.send(res)
});

app.post('/sling_tiers', function(request, response){
    var body = request.bodyl
    var res = sling.process(body)

})




app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


