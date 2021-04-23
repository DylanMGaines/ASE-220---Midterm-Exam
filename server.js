let fs = require('fs');
let path = require('path');
let axios = require('axios'); //currently unused
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let port = 1337;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static-files')));
app.use(session({ secret: 'my password' }));

//placeholder setup for profile page later
function seshCheck(req, res, next) {
    if (req.user) {
        //if session has a user in it,  lets the user load the page
        next();
    } else {
        res.send('Be Gone, Heathen');
        return;
    }
}

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

//admin page
app.get('/admin', function(req, res, next) {
    fs.readFile('admin/index.html', function(err, data) {
        res.send(data.toString());
    });
});

//returns the articles "database"
app.get('/API/articles', function(req, res, next) {
    fs.readFile('assets/articles.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//overwrites articles "database"
app.put('/API/articles', function(req, res, next) {
    fs.writeFile('assets/articles.json', JSON.stringify(req.body), function(err, data) {
        res.send('done');
    });
});

//overwrites user "database"
app.put('/API/users', function(req, res, next) {
    fs.writeFile('assets/users.json', JSON.stringify(req.body), function(err, data) {
        res.send('done');
    });
});

//users API -- returns users.json
app.get('/API/users', function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//returns card template
app.get('/API/templates/card', function(req, res, next) {
    fs.readFile('assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["card"]);
    });
});

//returns article template
app.get('/API/templates/modal', function(req, res, next) {
    fs.readFile('assets/modals.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//returns article template
app.get('/API/templates/article', function(req, res, next) {
    fs.readFile('assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["article"]);
    });
});

//sign in API
/** loads users.json, parses into users var, loops through users, if email or nameTag (username) matches entry,
 * sets up req sessions, responds with uID and role for client-side processing, returns to break loop.
 * If no match, returns -1 **/
app.post('/API/auth/signer', function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        if (err) console.log(err);
        let users = JSON.parse(data.toString());
        for (let i = 0; i < users.length; i++) {
            if ((users[i].nameTag == req.body.nameTag || users[i].email == req.body.nameTag) && users[i].password == req.body.password) {
                //user found in db
                req.session.user = {
                    ID: i,
                    nameTag: users[i].nameTag,
                    fName: users[i].fName,
                    lName: users[i].lName,
                    role: users[i].role
                };
                res.json({ status: 1, message: 'auth nailed', role: req.session.user.role, uID: users[i].uID });
                return;
            }
        }
        res.json({ status: -1, message: 'auth failed' });
    });
});

//sign out API
/** deletes server-side user record, responds, moves to next callback **/
app.get('/API/auth/signOut', function(req, res, next) {
    req.session.user = null;
    res.send('see ya space cowboy');
    next();
});

app.listen(port);
module.exports = app;