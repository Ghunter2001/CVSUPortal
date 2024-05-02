require('dotenv').config();
const express = require("express");
const fs = require("fs");
const pool = require('./database');

const app = express();







app.get('/sessionAdmin', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = 'SELECT username, role FROM admin';
    connection.query(query, (err, result) => {
      connection.release(); // Release the connection
      if (err) {
        console.log(err);
        res.status(500).send('Database query error');
        return;
      }

      if (result.length === 0) {
        res.status(404).send('Session name not found');
        return;
      }

      const sessionName = result[0].username;
      const sessionNumber = result[0].role;
      res.json({ sessionName, sessionNumber });
    });
  });
});




app.get('/loadAcadYear', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = 'SELECT * FROM acadyear WHERE status = "OPEN"';

    connection.query(query, function (err, result) {
      connection.release(); // Release the connection
      if (err) {
        console.log(err);
        res.status(500).send('Database query error');
        return;
      }

      const year = result[0].ayfrom + "-" + result[0].ayto;

      res.send(String(year));
    });
  });
});


app.get('/countEnrolled', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = 'SELECT COUNT(*) AS count FROM enrolledstudents WHERE status="ENROLLED"';

    connection.query(query, function (err, result) {
      connection.release(); // Release the connection
      if (err) {
        console.log(err);
        res.status(500).send('Database query error');
        return;
      }

      const count = result[0].count;

      res.send(String(count));
    });
  });
});


app.get('/countUsers', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.status(500).send('Database connection error');
      return;
    }


    const query = 'SELECT COUNT(*) AS count FROM details_students';

    connection.query(query, function (err, result) {
      connection.release(); // Release the connection
      if (err) {
        console.log(err);
        res.status(500).send('Database query error');
        return;
      }

      const count = result[0].count;

      res.send(String(count));
    });
  });
});

app.get('/countInstructor', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.status(500).send('Database connection error');
      return;
    }


    const query = 'SELECT COUNT(*) AS count FROM faculty';

    connection.query(query, function (err, result) {
      connection.release(); // Release the connection
      if (err) {
        console.log(err);
        res.status(500).send('Database query error');
        return;
      }

      const count = result[0].count;

      res.send(String(count));
    });
  });
});




//ENROLLMENT TAB
//DISPLAY ENROLLED
app.post("/addEnroll", async (req, res) => {
  try {
    const { snumber, lname, fname, mname, entry, CboCourse } = req.body;

    if (snumber !== "" || lname !== "" || fname !== "" || mname !== "" || entry !== "" || CboCourse !== "") {
      pool.getConnection((err, connect) => {
        if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
        }

        connect.query("SELECT * FROM enrolledstudents WHERE student_number = ?", [snumber], (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            res.send(`
                        <script>
                          alert("Already Exist");
                          window.location.href = "/enrollment"; 
                        </script>
                      `);
            connect.release();
          } else {
            connect.query("INSERT INTO enrolledstudents(student_number, course, lname, fname, mname,type) VALUES(?, ?, ?, ?, ?, ?)", [snumber, CboCourse, lname, fname, mname, entry], (err, result) => {
              if (err) throw err;

              res.send(`
                        <script>
                          alert("New Student Added.");
                          window.location.href = "/enrollment"; 
                        </script>
                      `);
              connect.release();
            });
          }
        });

      });
    } else {
      console.log("Input Details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});




app.get("/enrollment", function (req, res) {

  pool.query('SELECT * FROM enrolledstudents WHERE status="ENROLLED"', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableEnrolled(data, function (tableEnrolled) {

      fs.readFile(__dirname + "/pages/admin/TEnrollment.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Enrolled}}", tableEnrolled);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableEnrolled(data, callback) {
  let tableEnrolled = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Student Number</th>
            <th>Course</th>
            <th>Year Level</th>
            <th>Section</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableEnrolled += `
          <tr>
            <td><a onclick="deleteRow('${row.student_number}')"><img src="/img/delete.svg" alt="Delete"></a></td>
            <td>${row.student_number}</td>
            <td>${row.course}</td>
            <td>${row.yrlvl}</td>
            <td>${row.sec}</td>
            <td>${row.lname}</td>
            <td>${row.fname}</td>
            <td>${row.mname}</td>
            <td>${row.status}</td>
          </tr>`;
  }


  tableEnrolled += `
        </tbody>
      </table>
    </div>`;

  callback(tableEnrolled);
}


//DELETION 
app.post('/deleteEnroll', function (req, res) {
  const snumber = req.body.student_number;

  const queryString = 'UPDATE enrolledstudents SET status = "DROPPED" WHERE student_number = ?';
  pool.query(queryString, [snumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});


//SEARCH ENROLLED
app.get("/searchEnroll", function (req, res) {
  const searchTerm = req.query.search;

  pool.query('SELECT * FROM enrolledstudents WHERE student_number = ?', [searchTerm], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    if (data.length === 0) {
      return res.send("<p>No Data Found</p>"); // No data found, send custom message
    }

    generateTableEnrolled(data, function (tableEnrolled) {
      res.send(tableEnrolled);
    });
  });
});




//SEARCH REGISTER STUDENTS
app.get("/searchRegister", function (req, res) {
  const searchStudents = req.query.searchStudents; // Assuming lrn is sent as a query parameter

  pool.query('SELECT * FROM details_students WHERE lrn = ? OR lname = ?', [searchStudents,searchStudents], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const foundStudent = result[0];

    if (foundStudent) {
      res.json(foundStudent);
    } else {
      res.status(404).send('Student not found');
    }
  });
});






//ENROLLMENT END







//SCHEDULING TAB


app.post("/addSchedTemplate", async (req, res) => {
  try {
    const { template, adviser, subject, timeIn, timeOut } = req.body;

    if (template !== "" || adviser !== "" || subject !== "" || timeIn !== "" || timeOut !== "") {
      pool.getConnection((err, connect) => {
        if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
        }

        connect.query("SELECT * FROM templatesched WHERE templateName = ?", [template], (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            res.send(`
                        <script>
                          alert("Already Exist");
                          window.location.href = "/schedule"; 
                        </script>
                      `);
            connect.release();
          } else {
            connect.query("INSERT INTO templatesched(templateName, adviser, subcode, timeIn, timeOut) VALUES(?, ?, ?, ?, ?)", [template, adviser, subject, timeIn, timeOut], (err, result) => {
              if (err) throw err;

              res.send(`
                        <script>
                          alert("New Sched Template Added.");
                          window.location.href = "/schedule"; 
                        </script>
                      `);
              connect.release();
            });
          }
        });

      });
    } else {
      console.log("Input Details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});







app.post("/addSched", async (req, res) => {
  try {
    const { acadyear, tempCreated, advisory } = req.body;
    const selectedDays = req.body.days;

    if (acadyear !== "" || tempCreated !== "" || advisory !== "") {
      pool.getConnection((err, connect) => {
        if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
        }

        connect.query("SELECT * FROM createsched WHERE tempName = ?", [tempCreated], (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            res.send(`
                        <script>
                          alert("Already Exist");
                          window.location.href = "/schedule "; 
                        </script>
                      `);
            connect.release();
          } else {
            connect.query("INSERT INTO createsched(acadyear, tempName, days ,advisory) VALUES(?, ?, ?, ?)", [acadyear, tempCreated, selectedDays.join(""), advisory], (err, result) => {
              if (err) {
                console.error('Error inserting schedule into database: ' + err.stack);
                res.status(500).send('Error inserting schedule into database');
                return;
              }

              res.send(`
                <script>
                  alert("New Schedule Added.");
                  window.location.href = "/schedule"; 
                </script>
              `);
              connect.release();
            });
          }
        });

      });
    } else {
      console.log("Input Details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});









app.get("/schedule", function (req, res) {
  pool.query("SELECT t.adviser, t.subcode, concat(t.timeIn, '-', t.timeOut) as time, c.days, c.advisory, c.tempName FROM templatesched as t INNER JOIN createsched as c ON t.templateName = c.tempName", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result; // Assuming result contains the data directly

    generateTableSchedule(data, function (tableSchedule) {
      fs.readFile(__dirname + "/pages/admin/TSchedule.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }

        const updatedFileData = fileData.replace("{{TABLE_Schedule}}", tableSchedule);
        res.send(updatedFileData);
      });
    });
  });
});

function generateTableSchedule(data, callback) {
  let tableSchedule = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Adviser</th>
            <th>Subject Code</th>
            <th>Advisory</th>
            <th>Days</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>`;

  for (const row of data) {
    tableSchedule += `
          <tr>
            <td><a onclick="deleteSCHED('${row.tempName}')"><img src="/img/delete.svg" alt="Delete"></a></td>
            <td>${row.adviser}</td>
            <td>${row.subcode}</td>
            <td>${row.advisory}</td>
            <td>${row.days}</td>
            <td>${row.time}</td>
            <td style="display:none;">${row.tempName}</td>
          </tr>`;
  }

  tableSchedule += `
        </tbody>
      </table>
    </div>`;

  callback(tableSchedule);
}

app.post('/deleteSCHEDS', function (req, res) {
  const tempName = req.body.tempName;

  const queryString = 'DELETE t, c FROM templatesched AS t JOIN createsched AS c ON t.templateName = c.tempName WHERE c.tempName = ?';
  pool.query(queryString, [tempName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});









app.get("/acadyear", function (req, res) {
  pool.query("SELECT * FROM acadyear", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    generateTableHTML(data, function (tableHTML) {
      fs.readFile(__dirname + "/pages/admin/MAcadyear.html", "utf8", (err, fileData) => {
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
            <th>Aycode</th>
            <th>A.Y From</th>
            <th>A.Y To</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>`;

  for (const row of data) {
    tableHTML += `
          <tr>
            <td>${row.aycode}</td>
            <td>${row.ayfrom}</td>
            <td>${row.ayto}</td>
            <td>${row.sem}</td>
            <td>${row.status}</td>
            <td>
              <a onclick="updateStatus('${row.aycode}')"><img src="/img/check.svg" alt="Open" </a>
              <a onclick="deleteRow('${row.aycode}')"><img src="/img/delete.svg" alt="Delete" ></a>
            </td>
          </tr>`;
  }

  tableHTML += `
        </tbody>
      </table>
    </div>`;

  callback(tableHTML);
}







//DELETE DATA
app.post('/deleteSub', function (req, res) {
  const subcode = req.body.subcode;

  const queryString = 'DELETE FROM subject WHERE subcode = ?';
  pool.query(queryString, [subcode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});

//Dropdown Data
app.get('/adviserOption', (req, res) => {
  const queryString = 'SELECT fname, lname FROM faculty';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const adviser = result.map(row => ({ value: row.fname + " " + row.lname, text: row.fname + " " + row.lname }));
    res.json(adviser);
  });
});


app.get('/subjectOption', (req, res) => {
  const queryString = 'SELECT subcode FROM subject';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const subject = result.map(row => ({ value: row.subcode, text: row.subcode }));
    res.json(subject);
  });
});


app.get('/acadOption', (req, res) => {
  const queryString = 'SELECT aycode FROM acadyear';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const aycode = result.map(row => ({ value: row.aycode, text: row.aycode }));
    res.json(aycode);
  });
});

app.get('/tempOption', (req, res) => {
  const queryString = 'SELECT templateName FROM templatesched';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const temp = result.map(row => ({ value: row.templateName, text: row.templateName }));
    res.json(temp);
  });
});


app.get('/advisoryOption', (req, res) => {
  const queryString = 'SELECT yrlvl,sec FROM section';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const temp = result.map(row => ({ value: row.yrlvl + "-" + row.sec, text: row.yrlvl + "-" + row.sec }));
    res.json(temp);
  });
});


//SCHEDULING END




//ACADYEAR TAB

app.post("/addAcademicYear", async (req, res) => {
  try {
    const { TXTAyFrom, TXTAyTo, CboSem } = req.body;
    const aycode = TXTAyFrom + TXTAyTo + CboSem;

    if (TXTAyFrom && TXTAyTo && CboSem) {
      pool.query("SELECT * FROM acadyear WHERE aycode= ?", [aycode], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send('<script>alert("Already Exist");window.location.href="/acadyear";</script>');
        } else {
          pool.query("UPDATE acadyear SET status = 'CLOSE'", (err, result) => {
            if (err) throw err;

            res.send(`
              <script>
                if (confirm("Do you want to add this?")) {
                  alert("New Academic Year Added.");
                  window.location.href = "/saveAcademicYear?aycode=${aycode}&TXTAyFrom=${TXTAyFrom}&TXTAyTo=${TXTAyTo}&CboSem=${CboSem}";
                } else {
                  window.location.href = "/acadyear";
                }
              </script>
            `);
          });
        }
      });
    } else {
      console.log("Input Details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

app.get("/saveAcademicYear", async (req, res) => {
  try {
    const { aycode, TXTAyFrom, TXTAyTo, CboSem } = req.query;
    pool.query("INSERT INTO acadyear (aycode, ayfrom, ayto, sem) VALUES (?, ?, ?, ?)", 
      [aycode, TXTAyFrom, TXTAyTo, CboSem], (err, result) => {
        if (err) throw err;
        res.redirect("/acadyear");
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});





app.get("/acadyear", function (req, res) {
  pool.query("SELECT * FROM acadyear", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    generateTableHTML(data, function (tableHTML) {
      fs.readFile(__dirname + "/pages/admin/MAcadyear.html", "utf8", (err, fileData) => {
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
            <th>Aycode</th>
            <th>A.Y From</th>
            <th>A.Y To</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>`;

  for (const row of data) {
    tableHTML += `
          <tr>
            <td>${row.aycode}</td>
            <td>${row.ayfrom}</td>
            <td>${row.ayto}</td>
            <td>${row.sem}</td>
            <td>${row.status}</td>
            <td>
              <a onclick="updateStatus('${row.aycode}')"><img src="/img/check.svg" alt="Open" </a>
              <a onclick="deleteRow('${row.aycode}')"><img src="/img/delete.svg" alt="Delete" ></a>
            </td>
          </tr>`;
  }

  tableHTML += `
        </tbody>
      </table>
    </div>`;

  callback(tableHTML);
}

app.post('/delete', function (req, res) {
  const aycode = req.body.aycode;

  const queryString = 'DELETE FROM acadyear WHERE aycode = ?';
  pool.query(queryString, [aycode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});



app.post('/update', function (req, res) {
  const aycode = req.body.aycode;

  const queryClose = 'UPDATE acadyear SET status = "CLOSE"';
  pool.query(queryClose, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error Closing Year ');
    }

    const queryOpen = 'UPDATE acadyear SET status = "OPEN" WHERE aycode = ?';
    pool.query(queryOpen, [aycode], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error Opening Year');
      }
      console.log('Open Status');
    });
    console.log('Close Status');

    res.status(200).send('Update successfully');
  });
});


//ACADYEAR END



// COURSE TAB
app.post("/addCourseForm", (req, res) => {
  const { courseCode, courseDesc } = req.body;


  if (courseCode !== "" || courseDesc !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM course WHERE courseCode= ?", [courseCode], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/courses"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO course(courseCode, description) VALUES(?, ?)", [courseCode, courseDesc], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Course Added.");
                        window.location.href = "/courses"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });

    });
  } else {
    console.log("Input Details");
  }
});


app.get("/courses", function (req, res) {

  pool.query("SELECT * FROM course", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableCourses(data, function (tableCourses) {

      fs.readFile(__dirname + "/pages/admin/MCourses.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Courses}}", tableCourses);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableCourses(data, callback) {
  let tableCourses = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableCourses += `
          <tr>
            <td>${row.courseCode}</td>
            <td>${row.description}</td>
            <td>
              <a onclick="deleteRow('${row.courseCode}')"><img src="/img/delete.svg" alt="Delete"</button>
            </td>
          </tr>`;
  }

  tableCourses += `
        </tbody>
      </table>
    </div>`;


  callback(tableCourses);
}

// Function to delete row
app.post('/deleteCourse', function (req, res) {
  const courseCode = req.body.courseCode;

  const queryString = 'DELETE FROM course WHERE courseCode = ?';
  pool.query(queryString, [courseCode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});


//COURSE END


//SECTION TAB
app.post("/addSectionForm", (req, res) => {
  const { CboYear, CboSem, CboSec } = req.body;


  if (CboYear !== "" || CboSem !== "" || CboSec !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM section WHERE yrlvl = ? AND sem =? AND sec= ?", [CboYear, CboSem, CboSec], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/sections"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO section(yrlvl, sem, sec) VALUES(?, ?, ?)", [CboYear, CboSem, CboSec], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Section Added.");
                        window.location.href = "/sections"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });

    });
  } else {
    console.log("Input Details");
  }
});



app.get("/sections", function (req, res) {

  pool.query("SELECT * FROM section", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableSection(data, function (tableSection) {

      fs.readFile(__dirname + "/pages/admin/MSection.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Section}}", tableSection);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableSection(data, callback) {
  let tableSection = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="display: none;">secID</th>
            <th>Year Level</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableSection += `
          <tr>
            <td style="display: none;">${row.secID}</td>
            <td>${row.yrlvl}</td>
            <td>${row.sem}</td>
            <td>${row.sec}</td>
            <td>
              <a onclick="deleteRow('${row.secID}')"><img src="/img/delete.svg" alt="Delete"</button>
            </td>
          </tr>`;
  }

  tableSection += `
        </tbody>
      </table>
    </div>`;


  callback(tableSection);
}

app.post('/deleteSec', function (req, res) {
  const secID = req.body.secID;

  const queryString = 'DELETE FROM section WHERE secID = ?';
  pool.query(queryString, [secID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});



//SECTION END



// SUBJECTS TAB
app.post("/addSubjectForm", (req, res) => {
  const { CboCourse, subCode, subDesc, CboYear, CboSem, CboLec, CboLab, prereq } = req.body;

  if (CboCourse !== "" || subCode !== "" || subDesc !== "" || CboYear !== "" || CboSem !== "" || CboLec !== "" || CboLab !== "" || prereq !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM subject WHERE subcode= ?", [subCode], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/subjects"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO subject(course, subcode, description, yrlvl, sem, unitLec, unitLab, prerequisite) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [CboCourse, subCode, subDesc, CboYear, CboSem, CboLec, CboLab, prereq], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Section Added.");
                        window.location.href = "/subjects"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });

    });
  } else {
    console.log("Input Details");
  }
});



app.get("/subjects", function (req, res) {

  pool.query("SELECT * FROM subject", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableSubject(data, function (tableSubject) {

      fs.readFile(__dirname + "/pages/admin/MSubject.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Subject}}", tableSubject);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableSubject(data, callback) {
  let tableSubject = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Subject Code</th>
            <th>Description</th>
            <th>Year Level</th>
            <th>Semester</th>
            <th>Unit Lec</th>
            <th>Unit Lab</th>
            <th>Pre-Requisite</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableSubject += `
          <tr>
            <td>${row.course}</td>
            <td>${row.subcode}</td>
            <td>${row.description}</td>
            <td>${row.yrlvl}</td>
            <td>${row.sem}</td>
            <td>${row.unitLec}</td>
            <td>${row.unitLab}</td>
            <td>${row.prerequisite}</td>
            <td>
              <a onclick="deleteRow('${row.subcode}')"><img src="/img/delete.svg" alt="Delete"</button>
            </td>
          </tr>`;
  }

  tableSubject += `
        </tbody>
      </table>
    </div>`;


  callback(tableSubject);
}

//DELETE DATA
app.post('/deleteSub', function (req, res) {
  const subcode = req.body.subcode;

  const queryString = 'DELETE FROM subject WHERE subcode = ?';
  pool.query(queryString, [subcode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});

//Dropdown Data
app.get('/courseOption', (req, res) => {
  const queryString = 'SELECT courseCode FROM course';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const course = result.map(row => ({ value: row.courseCode, text: row.courseCode }));
    res.json(course);
  });
});


app.get('/prereqOption', (req, res) => {
  const queryString = 'SELECT subcode FROM subject';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const subject = result.map(row => ({ value: row.subcode, text: row.subcode }));
    res.json(subject);
  });
});


// SUBJECT TAB END




//DATA STUDENT TAB
app.post("/addstudentForm", (req, res) => {
  const { lrn, lname, fname, mname, cp, sex, bdate, email, address } = req.body;


  if (lrn !== "" || lname !== "" || fname !== "" || mname !== "" || cp !== "" || sex !== "" || bdate !== "" || email !== "" || address !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM details_students WHERE lrn= ? OR email = ?", [lrn, email], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/students"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO details_students(lrn, lname, fname, mname, bdate, Sex, cp, address, email) VALUES(?,?, ?, ?, ?, ?, ?, ?, ?)", [lrn, lname, fname, mname, bdate, sex, cp, address, email], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Student Added.");
                        window.location.href = "/students"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });
    });
  } else {
    console.log("Input Details");
  }
});






app.get("/students", function (req, res) {

  pool.query("SELECT * FROM details_students", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableStudent(data, function (tableStudents) {

      fs.readFile(__dirname + "/pages/admin/DataStudents.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Students}}", tableStudents);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableStudent(data, callback) {
  let tableStudents = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              Action
            </th>
            <th>LRN</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Namel</th>
            <th>Contact Number</th>
            <th>Sex</th>
            <th>Birthdate</th>
            <th>Email Address</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableStudents += `
          <tr>
            <td>
              <a onclick="archiveRow('${row.lrn}')"><img src="/img/delete.svg" alt="Delete"</button>
            </td>
            <td>${row.lrn}</td>
            <td>${row.lname}</td>
            <td>${row.fname}</td>
            <td>${row.mname}</td>
            <td>${row.cp}</td>
            <td>${row.Sex}</td>
            <td>${row.bdate}</td>
            <td>${row.email}</td>
            <td>${row.address}</td>
            <td>${row.Status}</td>
          </tr>`;
  }

  tableStudents += `
        </tbody>
      </table>
    </div>`;


  callback(tableStudents);
}

// Function to delete row
app.post('/archive', function (req, res) {
  const lrn = req.body.lrn;

  const queryString = 'UPDATE details_students SET status = "INACTIVE" WHERE lrn = ?';
  pool.query(queryString, [lrn], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error store row');
    }
    console.log('Row store');

    res.status(200).send('Row store successfully');
  });
});





app.post("/addTeachersForm", (req, res) => {
  const { output, fname, mname, lname, email} = req.body;


  if (output !== "" || lname !== "" || fname !== "" || mname !== "" || email !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM faculty WHERE teacherID= ?", [output], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/teachers"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO faculty(teacherID, fname, mname, lname, email) VALUES(?, ?, ?, ?, ?)", [output, fname, mname, lname, email], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Teachers Added.");
                        window.location.href = "/teachers"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });

    });
  } else {
    console.log("Input Details");
  }
});



app.get("/teachers", function (req, res) {

  pool.query("SELECT * FROM faculty", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableTeachers(data, function (tableTeachers) {

      fs.readFile(__dirname + "/pages/admin/DataTeachers.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_Teachers}}", tableTeachers);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableTeachers(data, callback) {
  let tableTeachers = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              Action
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableTeachers += `
          <tr>
            <td>
              <a onclick="archiveTeacher('${row.teacherID}')"><img src="/img/delete.svg" alt="Delete"</button>
            </td>

            <td>${row.teacherID}</td>
            <td>${row.fname} ${row.mname} ${row.lname}</td>
            <td>${row.email}</td>
            <td>${row.status}</td>
          </tr>`;
  }

  tableTeachers += `
        </tbody>
      </table>
    </div>`;


  callback(tableTeachers);
}

// Function to delete row
app.post('/archiveTeacher', function (req, res) {
  const teacherID = req.body.teacherID;

  const queryString = 'UPDATE faculty SET status = "INACTIVE" WHERE teacherID = ?';
  pool.query(queryString, [teacherID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error store row');
    }
    console.log('Row store');

    res.status(200).send('Row store successfully');
  });
});


app.get('/advisoryOption', (req, res) => {
  const queryString = 'SELECT yrlvl,sec FROM section';


  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const advisory = result.map(row => ({ value: row.yrlvl + row.sec, text: row.yrlvl + "-" + row.sec }));
    res.json(advisory);
  });
});











app.get("/Archive", function (req, res) {

  pool.query('SELECT * FROM enrolledstudents WHERE status="DROPPED"', function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableEArchive(data, function (tableArchive) {

      fs.readFile(__dirname + "/pages/admin/RArchive.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_CONTENT}}", tableArchive);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableEArchive(data, callback) {
  let tableArchive = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Student Number</th>
            <th>Course</th>
            <th>Year Level</th>
            <th>Section</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableArchive += `
          <tr>
            <td><a onclick="archiveRow('${row.student_number}')"><img src="/img/check.svg" alt="Unarchive"></a></td>
            <td>${row.student_number}</td>
            <td>${row.course}</td>
            <td>${row.yrlvl}</td>
            <td>${row.sec}</td>
            <td>${row.lname}</td>
            <td>${row.fname}</td>
            <td>${row.mname}</td>
            <td>${row.status}</td>
          </tr>`;
  }


  tableArchive += `
        </tbody>
      </table>
    </div>`;

  callback(tableArchive);
}

app.post('/unArchive', function (req, res) {
  const snumber = req.body.student_number;

  const queryString = 'UPDATE enrolledstudents SET status = "ENROLLED" WHERE student_number = ?';
  pool.query(queryString, [snumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting row');
    }
    console.log('Row deleted');

    res.status(200).send('Row deleted successfully');
  });
});



app.get("/archiveSelector", function (req, res) {
  const selector = req.query.selector;

  const selectTerm = `%${selector}%`;
  const values = [selectTerm];

  pool.query(`SELECT * FROM enrolledstudents WHERE status = "DROPPED" ?`, values, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;

    if (data.length === 0) {
      return res.send("<p>No Data Found</p>"); // No data found, send custom message
    }


    generateTableHTML(data, function (tableHTML) {
      res.send(tableHTML);
    });
  });
});


// app.get("/archiveSelector", function (req, res) {
//   const selector = req.query.selector;

//   const selectTerm = `%${selector}%`;
//   const values = [selectTerm];

//   pool.query(`SELECT * FROM details_students WHERE Status = "INACTIVE" ?`, values, function (err, result) {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Database query error");
//     }

//     const data = result;

//     if (data.length === 0) {
//       return res.send("<p>No Data Found</p>"); // No data found, send custom message
//     }


//     generateTableHTML(data, function (tableHTML) {
//       res.send(tableHTML);
//     });
//   });
// });


//POSTING TAB
app.post("/postForm", (req, res) => {
  const { pType, pDate, pTime, pTitle, pDesc, pCourse } = req.body;


  if (pType !== "" || pDate !== "" || pTime !== "" || pTitle !== "" || pDesc !== "" || pCourse !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM notice WHERE NoticeTitle= ?", [pTitle], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          res.send(`
                      <script>
                        alert("Already Exist");
                        window.location.href = "/notice"; 
                      </script>
                    `);
          connect.release();
        } else {
          connect.query("INSERT INTO notice(NoticeTitle, NoticeContent, CourseID, PostedDate, TimePosted, NoticeType) VALUES(?, ?, ?, ?, ?, ?)", [pTitle, pDesc, pCourse, pDate, pTime, pType], (err, result) => {
            if (err) throw err;

            res.send(`
                      <script>
                        alert("New Notice Added.");
                        window.location.href = "/notice"; 
                      </script>
                    `);
            connect.release();
          });
        }
      });

    });
  } else {
    console.log("Input Details");
  }
});


app.get("/notice", function (req, res) {

  pool.query("SELECT * FROM notice", function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database query error");
    }

    const data = result;


    generateTableNotice(data, function (tableNotice) {

      fs.readFile(__dirname + "/pages/admin/Posting.html", "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
        }


        const updatedFileData = fileData.replace("{{TABLE_NOTICE}}", tableNotice);

        res.send(updatedFileData);
      });
    });
  });
});

function generateTableNotice(data, callback) {
  let tableNotice = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Notice Type</th>
            <th>Notice Courses</th>
            <th>Date Posted</th>
            <th>Time Posted</th>
            <th>Notice Title</th>
            <th>Notice Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>`;

  for (const row of data) {
    tableNotice += `
          <tr>
            <td>${row.NoticeType}</td>
            <td>${row.CourseID}</td>
            <td>${row.PostedDate}</td>  
            <td>${row.TimePosted}</td>
            <td>${row.NoticeTitle}</td>
            <td>${row.NoticeContent}</td>
            <td>
              <!-- Update icon -->
              <img src="/img/edit.svg" class="edit-button" alt="Update" onclick="editRow('${row.NoticeTitle}')"
                   data-notice-type="${row.NoticeType}"
                   data-course-id="${row.CourseID}"
                   data-posted-date="${row.PostedDate}"
                   data-time-posted="${row.TimePosted}"
                   data-notice-title="${row.NoticeTitle}"
                   data-notice-content="${row.NoticeContent}">
              <!-- Delete icon -->
              <img src="/img/delete.svg" alt="Delete" onclick="deleteRow('${row.NoticeTitle}')">
            </td>
          </tr>`;
  }

  tableNotice += `
        </tbody>
      </table>
    </div>`;

  callback(tableNotice);
}

// Function to delete row
app.post('/NoticeDelete', function (req, res) {
  const pTitle = req.body.pTitle;

  const queryString = 'DELETE FROM notice WHERE NoticeTitle = ?';
  pool.query(queryString, [pTitle], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error deleting notice');
      }
      console.log('Notice deleted');
      res.status(200).send('Notice deleted successfully');
  });
});

// Function to Update Row
app.post('/NoticeEdit', function (req, res) {
  const { NoticeTitle, NoticeContent, CourseID, PostedDate, TimePosted, NoticeType } = req.body;

  const queryString = 'UPDATE notice SET NoticeContent = ?, CourseID = ?, PostedDate = ?, TimePosted = ?, NoticeType = ? WHERE NoticeTitle = ?';
  pool.query(queryString, [NoticeContent, CourseID, PostedDate, TimePosted, NoticeType, NoticeTitle], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating row');
    }
    console.log('Row updated');

    res.status(200).send('Row updated successfully');
  });
});

// POST DROPDOWN
app.get('/pCourseOption', (req, res) => {
  const queryString = 'SELECT courseCode FROM course';

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Error fetching credit units' });
    }
    const course = result.map(row => ({ value: row.courseCode, text: row.courseCode }));
    res.json(course);
  });
});

module.exports = app;