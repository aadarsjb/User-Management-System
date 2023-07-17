const express = require('express');
const session = require('express-session');
const router = express.Router();
const pool = require("./database");


router.use(express.urlencoded({extended: true}));

router.use(express.json());

router.use(session({
    secret: 'process.env.SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000     //set the session cookie to expire after 30 minutes of inactivity
    }
}));

router.get('/', function(req, res){
    const error = req.query.error; //Get the error paramater from the query string
    res.render('login', { user: req.session.user, error: error }); // Pass the string parameter to the login view
});

router.post('/goin', function(req, res) {
    const { username, password } = req.body; // request for username and password

    loginUser(username, password, function(error, user) {
        if (error) {
            res.status(500).send('Internal Error');
        } else {
            if (user) {
                req.session.user = user;
                res.redirect('/homepage');
            } else {
                res.redirect('/login?error=1');
            }
        }
    });
});

function loginUser(username, password, callback) {
    const sql = `SELECT * FROM users WHERE BINARY username = ? AND password = ?`;
    const values = [username, password];

    pool.query(sql, values, function(error, results) {
        if (error) {
            callback(error, null);
        }else {
            if (results.length > 0) {
                //user found
                const user = results[0];
                callback(null,user)
            } else {
                //User not found
                callback(null, null);
            }
        }
    });
}


module.exports = router;
