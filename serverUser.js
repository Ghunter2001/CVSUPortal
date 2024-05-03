require('dotenv').config();
const express = require("express");
const fs = require("fs");
const pool = require('./database');


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



  pool.query('SELECT s.adviser, s.subcode, s.time, s.days, s.advisory, sub.description FROM schedsub as s INNER JOIN enrolledstudents as e ON s.advisory = e.yrlvl INNER JOIN subject as sub ON sub.subcode = s.subcode WHERE e.yrlvl ="3-5"', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableDash(data, function (tableDash) {

      fs.readFile(__dirname + "/pages/students/dashboard.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_DASH}}", tableDash);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableDash(data, callback) {
  let tableDash = `
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


  for (const row of data) {
    tableDash += `
          <tr>
            <td>${row.subcode}</td>
            <td>${row.description}</td>
            <td>${row.days}</td>
            <td>${row.time}</td>
            <td>${row.room}</td>
            <td>${row.adviser}</td>
          </tr>
        `;
  }
  tableDash += `
            </tbody>
          </table>
        </div>
      `;


  callback(tableDash);
}











//CLASS SCHEDULES TAB
app.get("/classSched", function (req, res) {

  pool.query('SELECT s.adviser, s.subcode, s.time, s.days, s.advisory, sub.description FROM schedsub as s INNER JOIN enrolledstudents as e ON s.advisory = e.sec INNER JOIN subject as sub ON sub.subcode = s.subcode', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableSched(data, function (tableSched) {

      fs.readFile(__dirname + "/pages/students/classSched.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_SCHED}}", tableSched);

        res.send(updatedFileData);
      });
    });
  });
});


function generateTableSched(data, callback) {
  let tableSched = `
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
    tableSched += `
          <tr>
            <td colspan="6">No Classes Today</td>
          </tr>
        `;
  } else {
    for (const row of data) {
      tableSched += `
          <tr>
            <td>${row.subcode}</td>
            <td>${row.description}</td>
            <td>${row.days}</td>
            <td>${row.time}</td>
            <td>${row.room}</td>
            <td>${row.adviser}</td>
          </tr>
        `;
    }
  }

  tableSched += `
        </tbody>
      </table>
    </div>
  `;

  callback(tableSched);
}




app.get("/classScheds", function (req, res) {
  const selectedDay = req.query.day;

  const dayPattern = `%${selectedDay}%`;
  const values = [dayPattern];

  pool.query(`SELECT s.adviser, s.subcode, s.time, s.days, s.advisory, sub.description FROM schedsub as s INNER JOIN enrolledstudents as e ON s.advisory = e.sec INNER JOIN subject as sub ON sub.subcode = s.subcode WHERE days LIKE ?`, values, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    if (data.length === 0) {
      return res.send("<p>No Classes Today</p>"); // No data found, send custom message
    }


    generateTableSched(data, function (tableSched) {
      res.send(tableSched);
    });
  });
});

module.exports = app;