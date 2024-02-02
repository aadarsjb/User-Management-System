const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const pool = require('./database');
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

// Define the route handler for the GET request
router.get('/', async (req, res) => {
    try {
      const user = await getUserFromSession(req.session, res);
  
      // Update the 'Trunk Down Time' column using an SQL query
      const updateQuery = "UPDATE trunkdata SET `Trunk Down Time` = IF(`Time of Restoration(O-tech Email Confirmation)` = '' OR `Issue Escalated to MS` = '', '', TIMEDIFF(`Time of Restoration(O-tech Email Confirmation)`, `Issue Escalated to MS`))";
      pool.query(updateQuery, (error, results) => {
        if (error) {
          console.error('MySQL error', error);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        // Proceed with fetching the data after the update is complete
        const query = "SELECT *, TIME_FORMAT(`Trunk Down Time`, '%H:%i') AS `Trunk Down Time` FROM trunkdata";
        pool.query(query, (error, rows) => {
          if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('An error occurred while retrieving the data.');
          } else {
            // Format date fields using dayjs
            rows.forEach(row => {
              row['Issue Occurred in System'] = dayjs(row['Issue Occurred in System']).format('YYYY-MM-DD HH:mm:ss');
              row['Issue Escalated to MS'] = dayjs(row['Issue Escalated to MS']).format('YYYY-MM-DD HH:mm:ss');
              if (row['Time of Restoration(O-tech Email Confirmation)']) {
                row['Time of Restoration(O-tech Email Confirmation)'] = dayjs(row['Time of Restoration(O-tech Email Confirmation)']).format('YYYY-MM-DD HH:mm:ss');
              } else {
                row['Time of Restoration(O-tech Email Confirmation)'] = 'Not yet resolved';
              }
            });
  
            // Render the appropriate template based on the user's userType
            if (user.userType === 'normal') {
              res.render('homepage', { user });
            } else {
              res.render('show_table', { user, data: rows });
            }
          }
        });
      });
    } catch (error) {
      console.error('Error retrieving the data:', error);
      res.status(500).send('Internal server error');
    }
  });


  router.get('/export', function (req, res) {
    const fileName = 'Trunk table data'; // Set the fileName for the exported CSV file
    const columns = ["S. No.", "Case Ticket No", "Node", "ODN", "Incident Details", "P2P Link", "Node impacted", "Issue Occurred in System", "Issue Escalated to MS", "Time of Restoration(O-tech Email Confirmation)", "Escalated Team", "Reason for Outage (Otech)", "RX Power", "Trunk Down Time"]; // Replace with the actual column names of your table
  
    // Fetch the table data from the database
    const selectQuery = "SELECT *, TIME_FORMAT(`Trunk Down Time`, '%H:%i')AS `Trunk Down Time` FROM trunkdata";
    pool.query(selectQuery, (err, rows) => {
      if (err) {
        console.error('Error fetching table data:', err);
        res.status(500).send('An error occurred while fetching table data.');
      } else {
        const data = rows.map(row => [
          row['S. No.'],
          row['Case Ticket No'],
          row['Node'],
          row['ODN'],
          row['Incident Details'],
          row['P2P Link'],
          row['Node impacted'],
          row['Issue Occurred in System'],
          row['Issue Escalated to MS'],
          row['Time of Restoration(O-tech Email Confirmation)'],
          row['Escalated Team'],
          row['Reason for Outage (Otech)'],
          row['RX Power'],
          row['Trunk Down Time']
        ]);
  
        exportToCSV(res, fileName, columns, data);
      }
    });
  });
  
module.exports = router;
