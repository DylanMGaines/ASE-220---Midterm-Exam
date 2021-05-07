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
        res.status(307);
        res.send(data.toString());
    });
}

//placeholder setup for profile page later
function seshCheck(req, res, next) {
    if (req.session.user) {
        //if session has a user in it, lets the user load the page
        next();
    } else {
        redirector(res);
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

function updateID(parsed) {
    let i = 0;
    for (user in parsed) {
        parsed[user].uID = i++;
    }
    return parsed;
}

//*main page
app.get('/', function(req, res, next) {
    fs.readFile('index.html', function(err, data) {
        res.send(data.toString());
    });
});

//*article load
app.get('/article', function(req, res, next) {
    fs.readFile('article.html', function(err, data) {
        res.send(data.toString());
    });
});

//* SIGN UP PAGE
app.get('/newUser', function(req, res, next) {
    fs.readFile('register.html', function(err, data) {
        res.send(data.toString());
    });
});

//*returns the articles "database"
app.get('/API/articles', function(req, res, next) {
    fs.readFile('assets/articles.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//*returns a specific article
app.get('/API/article', function(req, res, next) {
    fs.readFile('assets/articles.json', function(err, data) {
        res.json(JSON.parse(data.toString())[req.query.a]);
    });
});

//*Updates a specific article
app.put('/API/article', function(req, res, next) {
    fs.readFile('assets/articles.json', function(err, data) {
        let parsed = JSON.parse(data.toString());
        parsed[req.body.aID] = req.body;
        fs.writeFile('assets/articles.json', JSON.stringify(parsed), function(err, data) {
            console.log('done');
        });
    });
});

//*TEMPLATE FOR CARD -- MAIN
//*returns card template
app.get('/API/templates/card', function(req, res, next) {
    fs.readFile('assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["card"]);
    });
});

//*sign in API
/** loads users.json, parses into users var, loops through users, if email or nameTag (username) matches entry,
 * sets up req sessions, responds with uID and role for client-side processing, returns to break loop.
 * If no match, returns -1 **/
app.post('/API/auth/in', function(req, res, next) {
    fs.readFile('users/users.json', function(err, data) {
        if (err) console.log(err);
        let users = JSON.parse(data.toString());
        for (let i = 0; i < users.length; i++) {
            if (users[i].nameTag == req.body.nameTag || users[i].email == req.body.nameTag) {
                if (bcrypt.compareSync(req.body.password, users[i].password)) {
                    //user found in db
                    req.session.user = {
                        ID: users[i].uID,
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

//* AUTHOR VERIFY
//verifies user is an authorized writer and wrote the tagged article
app.get('/API/auth/in', function(req, res, next) {
    if (req.query) {
        if (req.session.user) {
            if (req.session.user.ID) {
                console.log(req.query.a);
                fs.readFile('assets/articles.json', function(err, data) {
                    let parsed = JSON.parse(data.toString());
                    res.send(parsed[req.query.a].author == req.session.user.ID);
                    return;
                });
            }
        }
    }
});

//* Gets a user object
//returns a user.json
app.get('/API/user', function(req, res, next) {
    if (fs.existsSync('users/user_' + req.session.user.ID + '.json')) {
        if (req.session.user) {
            if (req.session.user.ID) {
                fs.readFile('users/user_' + req.session.user.ID + '.json', function(err, data) {
                    res.json(JSON.parse(data.toString()));
                });
            }
        }
    } else {
        res.send('nada');
    }
});

//*UPDATE USER ENTRY
app.put('/API/user', function(req, res, next) {
    let uf = 'users/user_' + req.session.user.ID + '.json';
    if (fs.existsSync(uf)) {
        fs.writeFile(uf, JSON.stringify(req.body), function(err, data) {
            res.send("new User done");
        });
    }
});

//*CREATE A NEW USER
app.post('/API/user', function(req, res, next) {
    for (thing in req.body) {
        if (thing == "liked" || thing == "role" || thing == "uID") {
            continue;
        }
        if (req.body[thing] == '') {
            res.status(406);
            res.send(thing);
            return;
        }
    }

    fs.readFile('users/users.json', function(err, data) {
        let parsed = JSON.parse(data.toString());
        console.log("parsed");
        let holdIt = req.body.password;
        req.body.uID = parsed.length;
        req.body.role = 2;
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        parsed.push(req.body);
        fs.writeFile('users/users.json', JSON.stringify(parsed), function(err, data) {
            console.log("users.json updated");
        });
        let uf = 'users/user_' + req.body.uID + '.json';
        fs.writeFile(uf, JSON.stringify(req.body), function(err, data) {
            console.log(uf + " updated");
            let ponse = {
                nameTag: req.body.nameTag,
                password: holdIt
            };
            res.json(ponse);
        });
    });
});

//*SIGN IN VERIFY
//check if username or email is taken, verifies if passwords, email or usernames are valid via matching a regex
app.get('/API/check', function(req, res, next) {
    let retMan = {
        feedback: "",
        free: 'N'
    };
    if (req.query.type) {
        //blank
        let re, regcheck;
        if (req.query.dayda == "") {
            retMan.feedback += req.query.type + "cannot be blank";
        } else { //non-blank
            let looper;
            if (req.query.type == 'Email') {
                re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                looper = 'email';
            } else if (req.query.type == 'password') {
                re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$");
            } else {
                re = /[^0-9a-zA-Z_]/;
                looper = 'nameTag';
            }
            //check user input against regular expression
            regcheck = re.test(req.query.dayda);

            if ((regcheck && req.query.type == 'Email') || (!regcheck && req.query.type == 'Username')) {
                retMan.free = 'T';
                fs.readFile('users/users.json', function(err, data) {
                    let parsed = JSON.parse(data.toString());
                    for (let i = 0; i < parsed.length; i++) {
                        if (parsed[i][looper] == req.query.dayda) {
                            retMan.free = 'F';
                            break;
                        }
                    }
                });
            } else if (regcheck && req.query.type == 'password') {
                retMan.free = 'V';
            } else {
                retMan.feedback = "Eneter a Valid " + req.query.type;
            }
            if (retMan.free == 'T') {
                retMan.feedback = req.query.type + "is available";
                retMan.free == true;
            } else if (retMan.free == 'F') {
                retMan.free == false;
                retMan.feedback = req.query.type + "is already registered";
            } else if (retMan.free == 'V') {
                retMan.feedback = "";
            }
        }
        res.send(retMan);
        console.log("Send Check");
    } else {
        retMan.feedback = "No thingy property in req";
        retMan.stop = true;
        res.send(retMan);
        console.log('ruh roh check no work');
        console.log(req.body);
    }
});

//Author edit
app.get('/author/create', seshCheck, function(req, res, next) {
    fs.readFile('create.html', function(err, data) {
        res.send(data.toString());
    });
});

//Author edit
app.get('/author/articles', seshCheck, function(req, res, next) {
    fs.readFile('library.html', function(err, data) {
        res.send(data.toString());
    });
});


//Author edit
app.get('/author/edit', seshCheck, function(req, res, next) {
    fs.readFile('edit.html', function(err, data) {
        res.send(data.toString());
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
    fs.readFile('edit.html', function(err, data) {
        res.send(data.toString());
    });
});

//admin edit page
app.get('/admin/create', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('create.html', function(err, data) {
        res.send(data.toString());
    });
});

//admin users page
app.get('/admin/users', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/users.html', function(err, data) {
        res.send(data.toString());
    });
});

//users API -- returns users.json
app.get('/admin/API/users', function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        res.json(JSON.parse(data.toString()));
    });
});

//gets template for admin-side card
app.post('/admin/API/users', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        let theGoods = JSON.parse(data.toString());
        req.body.uID = parseInt(req.body.uID);
        req.body.role = parseInt(req.body.role);
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        if (!(theGoods[req.body.uID])) {
            //&& !(theGoods[req.body.uID].nameTag)
            console.log("new entry");
            req.body.liked = [];
            theGoods.push(req.body);
        } else {
            //the entry exists
            if (!(theGoods[req.body.uID].liked) || ((theGoods[req.body.uID].liked.toString()) == '')) {
                //...but its liked attribute doesn't exist, or is empty

                req.body.liked = [];
                //create the liked attr for the req.body, so when it is pushed, the liked exists regardless

                theGoods[req.body.uID] = req.body;
            } else {
                console.log("liked exists");
            }
        }
        theGoods = JSON.stringify(theGoods);
        fs.writeFile('assets/users.json', theGoods, function(err, data) {
            res.send('written');
        });
    });
});


//delete users in admin thing
app.delete('/admin/API/users', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('assets/users.json', function(err, data) {
        let parsed = JSON.parse(data.toString());
        let done = false;
        for (entry in parsed) {
            if (req.body.victim == parsed[entry].uID) {
                parsed.splice(entry, 1);
                parsed = updateID(parsed);
                fs.writeFile('assets/users.json', JSON.stringify(parsed), function(err, data) {
                    done = true;
                });
            }
        }
        res.send((!done) ? "User Not Found, soz fam" : "Job Done");
    });
});

//gets template for admin-side card
app.get('/API/admin/templates/card', seshCheck, adminCheck, function(req, res, next) {
    fs.readFile('admin/assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["card"]);
    });
});

//gets template for author-side card
app.get('/author/API/templates/card', seshCheck, function(req, res, next) {
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

//gets template for admin-side card
app.get('/author/API/templates/article', seshCheck, function(req, res, next) {
    fs.readFile('admin/assets/templates.json', function(err, data) {
        res.json(JSON.parse(data.toString())["article"]);
    });
});

app.listen(port);
module.exports = app;