const express = require('express');
const router = express.Router();
const { getUserFromSession } = require('./homepage');
const pool = require('./database');

//Handle GET request to /update_ponlosstable

router.get('/', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        if ( user.userType === 'normal' ) {
            res.render('homepage', { user });
        } else {
            res.render('update_ponlosstable', { user, message: null });
        }
    }
    catch {
        console.error('Error retreving user:', error);
        res.status(500).send('Internal Server Error!');
    }
});


//Handels update request
router.post('/updated', async (req, res) => {
    const user = await getUserFromSession(req.session, res);
    const ticket_no = req.body.ticketno;
    const issue_resolved = req.body.issue_resolve_in_system;

    pool.query (
        "UPDATE ponlossdata SET `Issue Resolved by otech (Email confirmation)` = ? WHERE `Case Ticket No` = ?",
        [ issue_resolved, ticket_no ],
        (error) => {
            if (error) {
                console.error('MySql error:', error);
                res.status(500).send('Internal server error!');
                return;
            }
            console.log('Table updated successfully');
            res.render('update_ponlosstable', { user, message:'Table Updated successfully!'});
        }
    )
});


module.exports = router;