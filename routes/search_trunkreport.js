const express = require('express');
const router = express.Router();
const pool = require('./database');
const dayjs = require('dayjs');
const { getUserFromSession } = require('./homepage');

router.get('/', async (req, res) => {
    const user = await getUserFromSession(req.session, res);
    const Escalated_Day_Time = req.query.Escalated_Day_Time;
    pool.query(
        "SELECT * FROM `trunkdata` WHERE DATE_FORMAT(`Issue Escalated to MS`, '%Y-%m-%d %H-%i-%s') LIKE ? ",
        [`%${Escalated_Day_Time}%`],
        (error,result) => {
            if(error) {
                console.error('Mysql error:', error);
                res.status(500).send('Internal server error');
                return;
            }
            res.render('show_table', { user, data: result } );
        }

    )
})










module.exports = router;