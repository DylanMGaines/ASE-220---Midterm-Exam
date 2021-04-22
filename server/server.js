const axios = require('axios');
let fs = require('fs');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');
let port = 1337;


let app = express();


//console.log(Date.now().toString().slice(-6));

app.use(express.static(path.join(__dirname, 'static_files')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "my password" }));

function checkIfUserIsSignedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send('not signed in');
    }
}


//default, public
app.get('/', function(req, res, next) {
    fs.readFile('plebs.html', function(err, data) {
        //instead of loading the file from JSON blob, loads a local file
        res.send(data.toString());
    })
});

//private. Meant to be used to view and add user base, now has sign in functionality
app.get('/private', checkIfUserIsSignedIn, function(req, res, next) {
    fs.readFile('gamers.html', function(err, data) {
        //instead of loading the file from JSON blob, loads a local file
        res.send(data.toString());
    });
});

app.get('/admin', checkIfUserIsSignedIn, function(req, res, next) {
    fs.readFile('mods.html', function(err, data) {
        //instead of loading the file from JSON blob, loads a local file
        res.send(data.toString());
    })
});

//sign in man
app.get('/auth/signin', function(req, res, next) {
    fs.readFile('signin.html', function(err, data) {
        //instead of loading the file from JSON blob, loads a local file
        res.send(data.toString());
    })
});

//when GET request made to URL/API (eg 127.0.0.1:1337/API), the URL/API page gets the data and effectively a useable file
app.get('/API', function(req, res, next) {
    //example get
    fs.readFile('data/info.json', function(err, data) {
        res.json(data.toString());
    });
    return;
});

//GET reqs to this url get the users.json file
app.get('/API/users', function(req, res, next) {
    fs.readFile('data/users.json', function(err, data) {
        res.json(JSON.parse(data));
    });
    return;
});
//GET reqs to this url get the users.json file
app.post('/API/signin', function(req, res, next) {
    fs.readFile('data/users.json', function(err, data) {
        let users = JSON.parse(data);
        for (let i = 0; i <= users.length; i++) {
            if (users[i].email == body.email && users[i].password == body.password) {
                //saves user information in the session
                req.session.user = {
                    ID: i,
                    firstname: users[i].firstname,
                    lastname: users[i].lastname,
                    role: users[i].role
                };

                res.json({
                    status: 1,
                    message: "auth successful"
                });
                return;
            } else {
                res.json({
                    status: -1,
                    message: "auth failed"
                });
                return;
            }
        }
    });
    return;
});

//when POST request made to URL/API (eg 127.0.0.1:1337/API), the request is sent to JSON blob, which returns a response whose header.location (the thing that says where the JSON file is) is written to the API page, and becomes accessible
app.post('/API', function(req, res, next) {
    //example post
    fs.writeFile('data/info-' + Date.now() + '.json', JSON.stringify(req.body), function(err, data) {
        res.json(data);
    });
    return;
});

//submits new user
app.post('/API/users', function(req, res, next) {
    //gets the current db
    fs.readFile('data/users.json', function(err, data) {
        //converts to json
        let users = JSON.parse(data.toString());
        /* verify user isn't in db */
        //pushes input
        users.push(req.body);
        fs.writeFile('data/users.json', JSON.stringify(users), function(err, data) {
            //sends pushed data
            res.json(data);
        });
    });
    return;
});

//when put request made to URL/API (eg 127.0.0.1:1337/API), the requests body contains the data to be added, the put requst is sent to jsonBlob, which is updated, the res outputs the jsonblob response data
app.put('/API', function(req, res, next) {
    //completely overwrites file. Data in req.body must have any content the sender wants to remain
    //counter must be removed and replaced with a thing that sees which file is being added onto
    fs.writeFile('data/info' + Date.now() + '.json', JSON.stringify(req.body), function(err, data) {
        res.json(data);
    });

    return;
});


//when delete request made to URL/API (eg 127.0.0.1:1337/API)
app.delete('/API', function(req, res, next) {
    //counter must be removed and replaced with a thing that sees which file is being deleted
    fs.unlink('data/info' + Date.now() + '.json', function(err, data) {
        //just to see if error happens
        if (err) { console.log(err); }
    });

    res.json({
        "status": 1,
        "message": "file deleted"
    });
});

app.listen(port);
module.exports = app;