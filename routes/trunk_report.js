const express = require('express');
const router = express.Router();
const pool = require('./database');
const dayjs = require('dayjs');
const { getUserFromSession } = require('./homepage');

router.use(express.urlencoded({ extended: true }));



//Get user for the session and checks the usertype
router.get('/', async (req, res) =>  {
    try {
        const user = await getUserFromSession(req.session, res);
        if (user.userType === 'normal') {
            res.render('homepage', {user});
        } else {
            res.render('trunk_report',  {user, message: null }); //passing the message and the username
        }
    }

    catch (error) {
        console.error('Error retreving the user:', error);
        res.status(500).send('Internal server error');
    }
             
});



//Handles Form Submission

router.post('/trunkreport-submitted', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        const {Ticket_No, Node, ODN, Case, Trunk, Node_Impacted, Occured_in_System,Escalated_Day_Time, Team_Response_Day_Time, Escalated_Team, RX_Power, Reason } = req.body;
        const formData = {
            "Case Ticket No": Ticket_No,
            "Node": Node,
            "ODN": ODN,
            "Incident Details": Case,
            "P2P Link": Trunk,
            "Node impacted": Node_Impacted,
            "Issue Occurred in System": Occured_in_System,
            "Issue Escalated to MS": Escalated_Day_Time, 
            "Time of Restoration(O-tech Email confirmation)": Team_Response_Day_Time,
            "Escalated Team": Escalated_Team,
            "Reason for outage": Reason,
            "RX Power": RX_Power
    
        }
    
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to the database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query('Insert INTO trunkdata SET ?', formData, (err) => {
                connection.release();
    
                if (err) {
                    console.error('Error inserting the data:', err);
                    res.status(500).send('Internal Server Error.');
                    return;
                }
                dayjs(Occured_in_System).format('MM/DD/YYYY HH:mm:ss'),
                dayjs(Escalated_Day_Time).format('MM/DD/YYYY HH:mm:ss'),
                dayjs(Team_Response_Day_Time).format('MM/DD/YYYY HH:mm:ss'),
                console.log('Data inserted successfully');
                if (user.userType === 'normal') {
                    res.render('trunk_report', { user, message: 'Form submitted successfully' });
                } else {
                    res.redirect('/table', {user});
                }
                
            });       
        });
    } catch (error) {
        console.error("error retreving the data:", error);
        res.status(500).send("Internal server error");
    }
});


module.exports =  router;