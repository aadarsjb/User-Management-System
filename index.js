// Importing required dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//Function to start the server
const { startServer, getApp } = require('./connection');
const app = getApp();

//connects to the database
const pool = require("./routes/database");


const publicDirectory1 = path.join(__dirname, './public');
app.use(express.static(publicDirectory1));


// Importing all ejs files
const loginRouter = require('./routes/login');
const homepageRouter = require('./routes/homepage');



app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});


app.use(session({
    secret: 'process.env.SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000
    }
}));



app.engine('ejs', require('ejs').renderFile);
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




// For rendering login page
app.get('/', function ( req, res){
    res.render('login');
})

/*
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        //user is logged in, proceed to the next middleware
        next();
    } else {
        //user is not logged in, redirect to the login page
        res.redirect('/login');
    }
}
*/



app.use('/login', loginRouter);
app.use('/homepage', homepageRouter.router);


startServer();
