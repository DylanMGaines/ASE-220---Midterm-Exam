let fs = require('fs');
let path = require('path');
let axios = require('axios');
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let port = 1337;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static-files')));

/*<script src="../assets/jquery-3.6.0.min.js"></script>
<link href="./iCSS/theVibe.css" rel="stylesheet">
    <script src="./iJS/cardLoader.js"></script>
<script src="./iJS/shrinker.js"></script>
<script src="./iJS/signer.js"></script>
<script>
    $(document).ready(function() {
        //placehold();
        //signInSetUp();
    })
</script>*/

//main page
app.get('/', function(req, res, next) {
    fs.readFile('index.html', function(err, data) {
        res.send(data.toString());
    });
});

//article load
app.get('/article', function(req, res, next) {
    fs.readFile('article.html', function(err, data) {
        res.send(data.toString());
    });
});

app.get('/API/articles', function(req, res, next) {
    fs.readFile('assets/articles.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

app.put('/API/articles', function(req, res, next) {
    fs.writeFile('assets/articles.json', JSON.stringify(req.body), function(err, data) {
        res.json('done');
    });
});

app.get('/API/templates/card', function(req, res, next) {
    fs.readFile('assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["card"]);
    });
});

app.get('/API/templates/article', function(req, res, next) {
    fs.readFile('assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["article"]);
    });
});

app.listen(port);
module.exports = app;