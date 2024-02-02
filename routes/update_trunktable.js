const express = require('express');
const router = express.Router();
const pool = require('./database');
const { getUserFromSession } = require('./homepage');

//Handles GET request
router.get('/', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        if (user.userType === 'normal') {
            res.render('homepage');
        } else {
            res.render('update_trunktable', { user, message: null });
        }
    } 
    catch (error) {
        console.error('Error retreving user:', error);
        res.status(500).send('Internal Server Error');
    }
});


//Handles POST request for update
router.post('/update', async (req, res) => {
    const ticket_no = req.body.ticket_no;
    const Team_Response_Day_Time = req.body.Team_Response_Day_Time;
    const user = await getUserFromSession(req.session, res);

    pool.query(
        "UPDATE trunkdata SET `Time of Restoration(O-tech Email confirmation)` = ? WHERE `Case Ticket No` = ?",
        [Team_Response_Day_Time, ticket_no],
        (error) => {
            if (error) {
                console.error('MySql error:', error);
                res.status(500).send('Internal Server error');
                return;
            }
            console.log('Data updated successfully.');
            res.render('update_trunktable', { user, message: 'Table Updated Successfully!'});

         
        }      
    )
})


module.exports = router;