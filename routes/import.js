const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const router = express.Router();
const pool = require("./database");
const { getUserFromSession } = require("./homepage");

//Set the multer for file upload
const upload = multer({ dest: "uploads/" });

//Define  route for file upload
router.get("/", async (req, res) => {
  try {
    const user = await getUserFromSession(req.session, res);

    if (user.userType !== "superadmin") {
      res.render("homepage", { user });
    } else {
      res.render("import", { user, message: null });
    }
  } catch (error) {
    console.error("Error retreving the user:", error);
    res.status(500).send("Internal Server Error!");
  }
});

//Define route for the file handeling

// Define a route for the file upload handling
router.post("/newimport", upload.single("csvFile"), async (req, res) => {
  try {
    const { path, originalname } = req.file;
    console.log("Original name:", originalname);

    const tableName = originalname
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_]/gi, "_");

    // Read the CSV file and process the data
    const data = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        if (data.length === 0) {
          throw new Error("CSV file is empty");
        }

        // Get the column names from the first row
        let columnNames = Object.keys(data[0]);

        // Remove columns without a name (empty column names)
        columnNames = columnNames.filter(
          (columnName) => columnName.trim() !== ""
        );

        // Remove rows with incomplete or missing values
        const validRows = data.filter((row) =>
          columnNames.every((columnName) => row[columnName] !== undefined)
        );

        // Create an array of objects representing the data
        const formattedData = validRows.map((row) => {
          const rowData = {};
          columnNames.forEach((columnName) => {
            rowData[columnName] = row[columnName];
          });
          return rowData;
        });

        // Import the data into the MySQL database with the dynamic table name
        await importData(formattedData, tableName);

        // Delete the temporary file
        fs.unlinkSync(path);

        // Fetch the updated list of table names
        const tables = await getTables();

        res.render("import", {
          message: `${originalname} file imported successfully`,
          tables,
        });
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        res.render("import", { message: "Error reading CSV", tables: [] });
      });
  } catch (error) {
    console.error("Error importing CSV:", error);
    res.render("import", { message: "Error importing CSV", tables: [] });
  }
});

// Define a route for dropping a table
router.get("/droptable/:tableName", async (req, res) => {
  try {
    const tableName = req.params.tableName;
    await dropTable(tableName);
    const tables = await getTables(); // Fetch the updated list of table names
    res.render("import", {
      message: `${tableName} table dropped successfully`,
      tables: tables,
    }); // Pass the tables to the view
  } catch (error) {
    console.error("Error dropping table:", error);
    res.render("import", { message: "Error dropping table", tables: [] }); // Pass an empty tables array in case of error
  }
});

// Function to import the data into the MySQL database
async function importData(rows, tableName) {
  const connection = await getConnectionFromPool();
  try {
    await query(connection, "START TRANSACTION");

    // Check if the table already contains data
    const tableExists = await checkTableExists(connection, tableName);
    if (tableExists) {
      // Truncate the table to remove existing data
      await query(connection, `TRUNCATE TABLE ${tableName}`);
    } else {
      // Create the table with columns from the first row
      const columnNames = Object.keys(rows[0]);
      const columnDefinitions = columnNames
        .map((name) => {
          if (name === "Address" || name === "Customer Name") {
            // Use a larger character set and collation for the Address and Customer Name columns
            return `\`${name}\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
          } else {
            return `\`${name}\` VARCHAR(255)`;
          }
        })
        .join(",");

      // Specify the character set and collation for the table
      await query(
        connection,
        `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions}) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    }

    // Insert data into the table
    for (const row of rows) {
      const cleanedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (key === "Address" || key === "Customer Name") {
          const cleanedValue = removeUnsupportedCharacters(value);
          cleanedRow[key] = cleanedValue;
        } else {
          cleanedRow[key] = value;
        }
      }

      const columnNames = Object.keys(cleanedRow);
      const values = Object.values(cleanedRow);
      const columnDefinitions = columnNames
        .map((name) => `\`${name}\``)
        .join(",");
      const placeholders = columnNames.map(() => "?").join(",");
      await query(
        connection,
        `INSERT INTO ${tableName} (${columnDefinitions}) VALUES (${placeholders})`,
        values
      );
    }

    await query(connection, "COMMIT");
  } catch (error) {
    await query(connection, "ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

// Helper function to check if a table exists in the database
async function checkTableExists(connection, tableName) {
  const result = await query(connection, `SHOW TABLES LIKE '${tableName}'`);
  return result.length > 0;
}

// Helper function to remove unsupported characters from a string
function removeUnsupportedCharacters(value) {
  // Convert the string to a buffer using utf-8 encoding
  const buffer = Buffer.from(value, "utf-8");

  // Convert the buffer to a string using a suitable character encoding,
  // such as utf8mb4, which supports the full Unicode character set
  const cleanedValue = iconv.decode(buffer, "utf8mb4");

  return cleanedValue;
}

// Function to drop a table
async function dropTable(tableName) {
  const connection = await getConnectionFromPool();
  try {
    await query(connection, `DROP TABLE IF EXISTS ${tableName}`);
  } finally {
    connection.release();
  }
}

// Function to fetch the list of tables from the database
function getTables() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query("SHOW TABLES", (error, results) => {
          connection.release();
          if (error) {
            reject(error);
          } else {
            const tables = results.map((row) => row[`Tables_in_cgnet`]); // Replace "mydatabase" with your actual database name
            resolve(tables);
          }
        });
      }
    });
  });
}

/// Helper function to get a connection from the pool
function getConnectionFromPool() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

// Helper function to execute a query on the connection
function query(connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Helper function to remove unsupported characters from a string
function removeUnsupportedCharacters(value) {
  // Replace any unsupported characters with an empty string
  return value.replace(/[^\x00-\x7F]/g, "");
}

module.exports = router;
