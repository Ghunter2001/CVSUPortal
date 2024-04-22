const express = require("express");
const fs = require("fs");

require('dotenv').config();
const { createPool } = require("mysql");



const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT
  });


const app = express();



//SESSION NAME FOR USERS
app.get('/session', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = 'SELECT fname, lname, student_number FROM enrolledstudents';
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(err);
        res.status(500).send('Database query error');
        return;
      }

      if (result.length === 0) {
        res.status(404).send('Session name not found');
        return;
      }

      const sessionName = result[0].fname + ' ' + result[0].lname;
      const sessionNumber = result[0].student_number;
      res.json({ sessionName: sessionName, sessionNumber: sessionNumber });
    });
  });
});





//USER DASHBOARD TAB
app.get("/dashboard", function (req, res) {
  // const sessionNumber = req.body.sessionNumber;



  pool.query('SELECT * FROM schedule', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableHTML(data, function (tableHTML) {

      fs.readFile(__dirname + "/pages/students/dashboard.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_CONTENT}}", tableHTML);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableHTML(data, callback) {
  let tableHTML = `
      <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Description</th>
            <th>Time</th>
            <th>Room</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
      `;


  for (const row of data) {
    tableHTML += `
          <tr>
            <td>${row.subcode}</td>
            <td>${row.subjectDesc}</td>
            <td>${row.time}</td>
            <td>${row.room}</td>
            <td>${row.instructor}</td>
          </tr>
        `;
  }
  tableHTML += `
            </tbody>
          </table>
        </div>
      `;


  callback(tableHTML);
}




app.get("/grades", function (req, res) {
  res.sendFile(__dirname + "/pages/students/grades.html");
});






//CLASS SCHEDULES TAB
app.get("/classSched", function (req, res) {

  pool.query('SELECT * FROM schedule', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableHTML(data, function (tableHTML) {

      fs.readFile(__dirname + "/pages/students/classSched.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_CONTENT}}", tableHTML);

        res.send(updatedFileData);
      });
    });
  });
});


function generateTableHTML(data, callback) {
  let tableHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Description</th>
            <th>Day</th>
            <th>Time</th>
            <th>Room</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (data.length === 0) {
    tableHTML += `
          <tr>
            <td colspan="6">No Classes Today</td>
          </tr>
        `;
  } else {
    for (const row of data) {
      tableHTML += `
          <tr>
            <td>${row.subcode}</td>
            <td>${row.subjectDesc}</td>
            <td>${row.day}</td>
            <td>${row.time}</td>
            <td>${row.room}</td>
            <td>${row.instructor}</td>
          </tr>
        `;
    }
  }

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  callback(tableHTML);
}




app.get("/classScheds", function (req, res) {
  const selectedDay = req.query.day;

  const dayPattern = `%${selectedDay}%`;
  const values = [dayPattern];

  pool.query(`SELECT * FROM schedule WHERE day LIKE ?`, values, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    if (data.length === 0) {
      return res.send("<p>No Classes Today</p>"); // No data found, send custom message
    }


    generateTableHTML(data, function (tableHTML) {
      res.send(tableHTML);
    });
  });
});

module.exports = app;