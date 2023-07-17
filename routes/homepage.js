const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
        getUserFromSession(req.session)
        .then(user => {
          res.render('homepage', { user: user });
          console.log(user);
        })
        .catch(error => {
          console.error('Error retrieving user:', error);
          res.status(500).send('Internal server error');
        });
});

function getUserFromSession(session) {
        return new Promise((resolve, reject) => {
          const user = session.user;
          if (user) {
            resolve(user);
        } else {
            res.redirect('/login');
        }
});
}




module.exports = { router: router, getUserFromSession: getUserFromSession }