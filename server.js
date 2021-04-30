let fs = require('fs');
let path = require('path');
let axios = require('axios');
let express = require('express');
let bcrypt = require('bcrypt');
let bodyParser = require('body-parser');
let session = require('express-session');
let port = 1337;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static-files')));
app.use(session({ secret: 'wow' }));

function redirector(res) {
    fs.readFile('redirect.html', function(err, data) {
        res.send(data.toString());
    });
}

//placeholder setup for profile page later
function seshCheck(req, res, next) {
    if (req.session.user) {
        //if session has a user in it, lets the user load the page
        next();
    } else {
        console.log(next);
        redirector(res);
        console.log("redirected");
    }
}

function adminCheck(req, res, next) {
    if (req.session.user.role) {
        if (req.session.user.role == 1) {
            next();
        }
    } else {
        res.send('you are not worthy');
        redirector(res);
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

//users API -- returns users.json
app.get('/API/users', function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//users API -- returns users.json
app.get('/admin/API/users', function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//overwrites user "database"
app.put('/API/users', function(req, res, next) {
    fs.writeFile('assets/users.json', JSON.stringify(req.body), function(err, data) {
        res.send('done');
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
            if (users[i].nameTag == req.body.nameTag || users[i].email == req.body.nameTag) {
                if (bcrypt.compareSync(req.body.password, users[i].password) || req.body.password == users[i].password) {
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

//I have no clue why, but this just doesn't work without the /admin
/** deletes server-side user record, responds, moves to next callback **/
app.get('/admin/API/auth/signOut', function(req, res, next) {
    req.session.user = null;
    res.send('see ya space cowboy');
    next();
});

//admin page
app.get('/admin', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/index.html', function(err, data) {
        res.send(data.toString());
    });
});

//admin edit page
app.get('/admin/edit', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/edit.html', function(err, data) {
        res.send(data.toString());
    });
});

//admin edit page
app.get('/admin/create', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/create.html', function(err, data) {
        res.send(data.toString());
    });
});

//admin users page
app.get('/admin/users', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/users.html', function(err, data) {
        res.send(data.toString());
    });
});

//gets template for admin-side card
app.post('/admin/API/users', seshCheck, adminCheck, function(req, res, next) {
    console.log('caught');
    fs.readFile('assets/users.json', function(err, data) {
        console.log(req.body);
        console.log(data.toString());
        console.log('\n\n');
        let theGoods = JSON.parse(data.toString());
        req.body.uID = parseInt(req.body.uID);
        req.body.role = parseInt(req.body.role);
        req.body.password = bcrypt.hashSync(req.body.password, 10);

        if (!(theGoods[req.body.uID]) && !(theGoods[req.body.uID].nameTag)) {
            res.send("new entry");
            console.log("new entry");
            req.body.liked = [];
            console.log("JSON.stringify(theGoods)");
            theGoods.push(req.body);
            console.log("pushed");
            console.log("logged");
        } else {
            //the entry exists
            if (!(theGoods[req.body.uID].liked) || ((theGoods[req.body.uID].liked.toString()) == '')) {
                //...but its liked attribute doesn't exist, or is empty

                req.body.liked = [];
                //create the liked attr for the req.body, so when it is pushed, the liked exists regardless

                theGoods[req.body.uID] = req.body;
            } else {
                console.log("oioi");
            }
            console.log('in else');
            res.send("beep beep");
        }
        theGoods = JSON.stringify(theGoods);
        fs.writeFile('assets/users.json', theGoods, function(err, data) {
            console.log('beed');
        });
    });
});

//gets template for admin-side card
app.get('/API/admin/templates/card', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["card"]);
    });
});

//gets template for admin-side card
app.get('/API/admin/templates/article', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["article"]);
    });
});

app.listen(port);
module.exports = app;