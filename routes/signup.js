const express = require('express');
const router = express.Router();
const pool = require('./database');
const { getUserFromSession } = require('./homepage');

router.get('/', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        if ( user.userType !== 'superadmin' ) {
            console.log(user);
            res.render('homepage', { user });
        } else {
            res.render('signup', { user, message: null });
        }
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send('Internal server error!');
    }
    
});


router.post('/submitted', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        const { firstname, lastname, username, email, password, userType } = req.body;
    
        const sql = "INSERT INTO users ( firstname, lastname, username, email, password, userType ) VAlUES (?, ?, ?, ?, ?, ?)";
        const values = [ firstname, lastname, username, email, password, userType ];
    
        pool.query(sql, values, function (error, result) {
            if (error) {
                console.error('Error executing the query:', error.stack );
                res.statusMessage(500).send('Internal server error!');
            } else {
                res.render('signup', { user, message: 'Signed Up Successfully' });
            }
        })
    }

    catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send('Internal Server Error!');
    }
});



module.exports = router;