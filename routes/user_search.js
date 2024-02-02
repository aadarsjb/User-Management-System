const express = require('express');
const router = express.Router();
const pool = require('./database');
const Papa = require("papaparse");
const { getUserFromSession } = require('./homepage');


//Configure session middleware
const session = require("express-session");
router.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        })
);

//Function for fetching data from dtabase
//takes user input as query paramaters
function getDataFromDatabase(sql, queryParams, callback) {
    pool.query(sql, queryParams, function (error, result) {
        if (error) {
            console.error("Error executing the query:", error.stack);
            return callback(error);
        }
        callback(null, result);   //pass null or the data from the database as result
    });
};


//Function to export all search results as .csv file

function exportToCSV(res, fileName, columns, data) {
    const csv = Papa.unparse({
        fields: columns,
        data: data,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}.csv"`
    );

    res.send(csv);
    
}


//Ruute for user search page

router.get('/', async (req, res) => {
    try {
        var user = await getUserFromSession(req.session, res);  //request the session for user data
        if(user.userType === 'normal') {
            res.render('homepage', {user});  //checks the usertypes
        } else {
            res.render('user_search', {user});
        }
    }

    catch (error) {
        console.error('Error retreving user:', error);
        res.status(500).send('Internal server error');
    }
   
});




//query for all searches 
router.get("/search", async (req, res) =>{
    const user = await getUserFromSession(req.session, res);
    const {
        POP,
        PON,
        Geography
    } = req.query; // Takes User Input as parameters
     req.session.iv_result = [];
     req.session.ov_result = [];
    let sql = ""; //stores query
    const queryParams = [];

    if (Geography === "Inside Valley") {
        //Sql query for Inside Valley
        sql = `SELECT iv_final.\`Object Name\`, billing.\`Username\`, billing.Status, billing.\`Customer Name\`,
        billing.Phone, Iv_connection.Latitude, iv_connection.Longitude, iv_connection.\`CDB No.\`, billing.Address, iv_connection.PON 
        FROM iv_connection

        INNER JOIN iv_final ON iv_connection.\`Serial Number\` = iv_final.\`Serial Number\`
        AND iv_connection.\`Serial Number\` IS NOT NULL
        AND iv_final.\`Serial Number\` IS NOT NULL
        AND iv_connection.\`Serial Number\` <> '' 

        INNER JOIN billing ON iv_connection.\`Username\` = billing.\`Username\`
        AND iv_connection.\`Username\` IS NOT NULL
        AND billing.\`Username\` IS NOT NULL
        AND iv_connection.\`Username\` <> '' 

        WHERE 1=1`;


        if (POP) {
            sql += " AND iv_final.`Object Name` LIKE ? "; // Assuming POP is the Indexed column
            queryParams.push(`%${POP}%`);
        }

        //logic for multiple pon search
        if (PON) {
            if (PON === "1/1/1/1" || PON === "1/1/2/1" || PON === "1/1/3/1" || PON === "1/1/4/1") {
                sql += " AND iv_connection.PON = ?";
                queryParams.push(PON);
            } else if (PON) {
                const PONValues = PON.split("-");
                sql += " AND (";
                for (let i = 0; i < PONValues.length; i++) {
                    const paramName = `PON${i}`;
                    sql += `iv_connection.PON LIKE ? OR `;
                    queryParams.push(`${PONValues[i]}%`);
                }
                sql = sql.slice(0, -4) + ")"; // Remove the extra "OR" and close the parentheses
            }
        }


    } else {
        // Construct the SQL query for other than 'Inside Valley'.
        //Note: Column name should match with the database columns
    sql = `SELECT ov_final.\`Device Name\`, billing.\`Username\`, billing.Status, billing.\`Customer Name\`, billing.Phone, ov_connection.\`CDB No.\`, billing.Address, ov_connection.\`Slot, Pon\` FROM ov_connection
    INNER JOIN billing ON ov_connection.Username = billing.\`Username\` 
    AND ov_connection.Username IS NOT NULL 
    AND billing.\`Username\` IS NOT NULL
    AND ov_connection.Username <> ''

    INNER JOIN ov_final ON ov_connection.\`Serial Number\` = ov_final.\`ONT Serial\` 
    AND ov_connection.\`Serial Number\` IS NOT NULL 
    AND ov_final.\`ONT Serial\` IS NOT NULL
    AND ov_connection.\`Serial Number\` <> ''
    WHERE 1=1`;

        //Logic for searching PON

        if (POP) {
            sql += " AND ov_final.\`Device Name\` LIKE ?";     //Checks for device name in the database ov-final table 
            queryParams.push(`%${POP}%`);
        }

        if (PON) {
            sql += " AND ov_connection.\`Slot, Pon\` = ?";    //Checks for  in the database ov-final table 
            queryParams.push(PON);
        }
    }

    //calling the function 

    getDataFromDatabase(sql, queryParams, function (error, result) {

        if (error) {
            return res.status(500).send("Internal Server error");
        }

        if (Geography === "Inside Valley") {
            req.session.iv_result = result;  //store result in the session
        } else {
            req.session.ov_result = result;
        }

        res.render("user_search", {
            user: user,
            iv_result: req.session.iv_result,
            ov_result: req.session.ov_result,
            iv_resultl: result.length,
            ov_result1: result.length,
            POP: POP,
            PON: PON,
            
            noResults: 
            req.session.iv_result.length === 0 &&
            req.session.ov_result.length === 0,
            Geography: Geography,
            fileName: `Geography= ${Geography}, POP=${POP}, PON=${PON}`, // Set the fileName variable for exporting
        });
    });
});



router.get('/export', function (req, res) {
    const {Geography, fileName } = req.query;

    //Export the data based on the selected geography
    if (Geography === 'Inside Valley') {
        if(req.session.iv_result.length > 0 ) {
            const columns = [
                "Object Name",
                "Username",
                "Serial Number",
                "Status",
                "Customer Name",
                "Phone",
                "Latitude",
                "Longitude",
                "CBD No.",
                "Address",
                "PON",
            ];

            const data = req.session.iv_result.map((row) => [
                row["Object Name"],
                row["Username"],
                row["Serial Number"],
                row["Status"],
                row["Customer Name"],
                row["Phone"],
                row["Latitude"],
                row["Longitude"],
                row["CBD No."],
                row["Address"],
                row["PON"],
            ]);

            exportToCSV(res, fileName, columns, data);
        }
    } else {
        if (req.session.ov_result.length > 0) {
            const columns = [
                "Device Name",
                "Username",
                "ONT Serial",
                "Status",
                "Customer Name",
                "Phone",
                "CBD No.",
                "Address",
                "Slot, Pon",
            ];

            const data = req.session.ov_result.map((row) => [
                row["Device Name"],
                row["Username"],
                row["ONT Serial"],
                row["Status"],
                row["Customer Name"],
                row["Phone"],
                row["CBD No."],
                row["Address"],
                row["Slot, Pon"],
            ]);
            exportToCSV(res, fileName, columns, data);
        }
    }
});



module.exports = router;