const express = require('express');
const router = express.Router();
const pool = require('./database');
const dayjs = require('dayjs');
const Papa = require('papaparse');
const { getUserFromSession } = require('./homepage');

function exportToCSV(res, fileName, columns, data) {
  const csv = Papa.unparse({
      fields: columns,
      data: data,
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachmet; filename=${fileName}.csv`);
  res.send(csv);
}



router.get('/', async (req, res) => {
    try {
        const user = await getUserFromSession(req.session, res);
        const updateQuery = "UPDATE ponlossdata SET `Ponloss Down Time` = IF(`Issue Resolved by otech (Email confirmation)` = '' OR `Issue Escalated to MS` = '', '', TIMEDIFF(`Issue Resolved by otech (Email confirmation)`, `Issue Escalated to MS`))";
    
        pool.query(updateQuery, (error, results) => {
          if (error) {
            console.error('MySQL error', error);
            res.status(500).send('Internal Server Error');
            return;
          }
    
          const query = "SELECT *, TIME_FORMAT(`Ponloss Down Time`, '%H:%i') AS `Ponloss Down Time` FROM ponlossdata";
    
          pool.query(query, function (error, rows) {
            if(error) {
              console.error("Error fetching the data", error);
              res.status(500).send("An error occurred while retrieving the data.");
            } else {
              rows.forEach( row => {
                row['Issue Occurred in AMS/System'] = dayjs(row['Issue Occurred in AMS/System']).format('YYYY-MM-DD HH:mm:ss');
              });
    
              rows.forEach( row => {
                row['Issue Escalated to MS'] = dayjs(row['Issue Escalated to MS']).format('YYYY-MM-DD HH:mm:ss');
              });
    
              rows.forEach( row => {
                if (row['Issue Resolved by otech (Email confirmation)']) {
                  row['Issue Resolved by otech (Email confirmation)'] = dayjs(row['Issue Resolved by otech (Email confirmation)']).format('YYYY-MM-DD HH:mm:ss');
                } else {
                  row['Issue Resolved by otech (Email confirmation)'] = 'Not yet resolved';
                }
              });
            }
            if (user.userType === 'normal') {
                res.render('homepage', {user});
            } else {
                res.render('ponloss_table', { user, data: rows });
            }
           
          });
        });
    }
    catch (error) {
        console.error('Error retreving user:', error);
        res.status(500).send('Internal server error');
    }

});

router.get('/exp', function (req, res) {
  const fileName = 'Ponloss table data'; // Set the fileName for the exported CSV file
  const columns = ["S. No.", "Case Ticket No", "ODN", "Incident Details", "Incident Category", "Node impacted", "Issue Occurred in AMS/System", "Issue Escalated to MS", "Number of Customer Impacted", "Issue Resolved by otech (Email confirmation)", "Reason for Outage (Otech)", "Ponloss Down Time"]; // Replace with the actual column names of your table

  // Fetch the table data from the database
  const selectQuery = "SELECT *, TIME_FORMAT(`Ponloss Down Time`, '%H:%i') AS `Ponloss Down Time` FROM ponlossdata";
  pool.query(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error fetching table data:', err);
      res.status(500).send('An error occurred while fetching table data.');
    } else {
      const data = rows.map(row => [
        row['S. No.'],
        row['Case Ticket No'],
        row['ODN'],
        row['Incident Details'],
        row['Incident Category'],
        row['Issue Occurred in AMS/System'],
        row['Issue Escalated to MS'],
        row['Number of Customer Impacted'],
        row['Issue Resolved by otech (Email confirmation)'],
        row['Reason for Outage (Otech)'],
        row['Ponloss Down Time']
      ]);

      exportToCSV(res, fileName, columns, data);
    }
  });
});



module.exports = router;