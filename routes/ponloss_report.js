const express = require('express');
const pool = require('./database');
const router = express.Router();
const dayjs = require('dayjs');
const { getUserFromSession } = require('./homepage');

router.use(express.urlencoded({ extended: true}));
router.use(express.json());

//Handels GET request
router.get('/', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        if (user.userType === 'normal') {    
            res.render('homepge', { user });      //Normal user will be redirected to homepge
        } else {
            res.render('ponloss_report', { user, message: null});
        }
    } 
    catch (error) {
        console.error('Error retreving user:', user);
        res.status(500).send('Internal server error');
    }

});

//Handel POST request
router.post('/submitted', (req, res) => {
    const { Ticket_no, odn, details, category, issue_occured_in_ams, issue_escalated_in_ms, customer_impacted, issue_resolved_in_system, reason_for_outage } = req.body;

    //Create new database entry
    const formData = {
        "Case Ticket No": Ticket_no,
        "ODN": odn,
        "Incident Details": details,
        "Incident Category": category,
        "Issue Occurred in AMS/System": issue_occured_in_ams,
        "Issue Escalated to MS": issue_escalated_in_ms,
        "Number of Customer Impacted": customer_impacted,
        "Issue Resolved by otech (Email confirmation)": issue_resolved_in_system,
        "Reason for Outage (Otech)": reason_for_outage
    };

    //Insert the form data into database
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).send('Internal server error');
            return;
        }

        connection.query('INSERT INTO ponlossdata SET ?', formData, (err, result) => {
            connection.release();  //Release the connection
            
            if (err) {
                console.error('Error inserting the data into the database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            dayjs(issue_occured_in_ams).format('YYYY-MM-DD HH:mm:ss'),
            dayjs(issue_escalated_in_ms).format('YYYY-MM-DD HH:mm:ss'),
            dayjs(issue_resolved_in_system).format('YYYY-MM-DD HH:mm:ss'),
            res.render('ponloss_report', { user, message: 'Report Submitted'} );
        })
    })

}) 


module.exports = router;