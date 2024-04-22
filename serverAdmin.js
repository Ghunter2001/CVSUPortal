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

app.get("/adminDash", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/adminDash.html");
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

    const query = 'SELECT COUNT(*) AS count FROM enrolledstudents';

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






app.get("/enrollment", function (req, res) {

  pool.query("SELECT * FROM enrolledstudents", function (err, result) {
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
            <th>
              Action
            </th>
            <th>Student Number</th>
            <th>Course</th>
            <th>Year Level</th>
            <th>Section</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Contact Number</th>
            <th>Sex</th>
            <th>Birthdate</th>
            <th>Email Address</th>
            <th>Address</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableEnrolled += `
          <tr>
            <td>
              <button onclick="deleteRow('${row.student_number}')">Delete</button>
            </td>

            <td>${row.student_number}</td>
            <td>${row.course}</td>
            <td>${row.yrlvl}</td>
            <td>${row.sec}</td>
            <td>${row.lname}</td>
            <td>${row.fname}</td>
            <td>${row.mname}</td>
            <td>${row.cp}</td>
            <td>${row.sex}</td>
            <td>${row.birthdate}</td>
            <td>${row.email}</td>
            <td>${row.address}</td>
            <td>${row.status}</td>
            <td>${row.role}</td>
          </tr>`;
  }

  tableEnrolled += `
        </tbody>
      </table>
    </div>`;


  callback(tableEnrolled);
}

// Function to delete row
function deleteRow(student_number) {
  // Execute a query to delete the row with the given aycode
  const queryString = "DELETE FROM enrolledstudents WHERE student_number = ?";
  pool.query(queryString, [student_number], (err, result) => {
    if (err) {
      console.error(err);
      // Handle error response
    } else {
      // Row deleted successfully
      // You can send a success response or handle it as needed
    }
  });
}



app.get("/enrollment", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/TEnrollment.html");
});



app.get("/schedule", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/TSchedule.html");
});




app.get("/history", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/RHistory.html");
});



app.get("/Archive", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/RArchive.html");
});


app.get("/requirements", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/RReq.html");
});

//ACADYEAR TAB

app.post("/addAcademicYear", async (req, res) => {
  try {
    const { TXTAyFrom, TXTAyTo, CboSem } = req.body;
    const aycode = TXTAyFrom + TXTAyTo + CboSem;


    if (TXTAyFrom !== "" || TXTAyTo !== "" || CboSem !== "") {
      pool.getConnection((err, connect) => {
        if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
        }

        connect.query("SELECT * FROM acadyear WHERE aycode= ?", [aycode], (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            res.send(`
                        <script>
                          alert("Already Exist");
                          window.location.href = "/acadyear"; 
                        </script>
                      `);
            connect.release();
          } else {
            connect.query(`UPDATE acadyear SET status = "CLOSE"`, (err, result) => {
                if (err) {
                  throw err;
                } else {
                  connect.query(`INSERT INTO acadyear (aycode, ayfrom, ayto, sem) VALUES (?, ?, ?, ?)`,
                    [aycode, TXTAyFrom, TXTAyTo, CboSem], (err, result) => {
                      if (err) throw err;

                      res.send(`
                        <script>
                          alert("New Section Added.");
                          window.location.href = "/acadyear"; 
                        </script>
                      `);
                    });
                }
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
              <button onclick="updateStatus('${row.aycode}')">Open</button>
              <button onclick="deleteRow('${row.aycode}')">Delete</button>
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



app.get("/acadyear", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MAcadyear.html");
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
              <button onclick="deleteRow('${row.courseCode}')">Delete</button>
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
app.post('/delete', function (req, res) {
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

app.get("/courses", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MCourses.html");
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
              <button onclick="deleteRow('${row.secID}')">Delete</button>
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

app.get("/sections", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MSection.html");
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
              <button onclick="deleteRow('${row.subcode}')">Delete</button>
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



app.get("/subjects", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MSubject.html");
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
            <th>Role</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableStudents += `
          <tr>
            <td>
              <button onclick="archiveRow('${row.lrn}')">Delete</button>
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
            <td>${row.role}</td>
            
            
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


app.get("/students", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/DataStudents.html");
});




app.post("/addTeachersForm", (req, res) => {
  const { output, fname, mname, lname, bdate, sex, cp, email, address } = req.body;


  if (ouput !== "" || lname !== "" || fname !== "" || mname !== "" || cp !== "" || sex !== "" || bdate !== "" || email !== "" || address !== "") {
    pool.getConnection((err, connect) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }


      connect.query("SELECT * FROM details_teachers WHERE T_ID= ?", [output], (err, result) => {
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
          connect.query("INSERT INTO details_teachers(T_ID, FirstName, LastName, MiddleName, Sex, Address, Email, BirthDate, ContactNumber) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [output, fname, mname, lname, bdate, sex, cp, email, address], (err, result) => {
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

  pool.query("SELECT * FROM details_teachers", function (err, result) {
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
            <th>ID Number</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Birtdate</th>
            <th>Sex</th>
            <th>Contact Number</th>
            <th>Email Address</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>`;


  for (const row of data) {
    tableTeachers += `
          <tr>
            <td>
              <button onclick="deleteRow('${row.T_ID}')">Delete</button>
            </td>

            <td>${row.T_ID}</td>
            <td>${row.FirstName}</td>
            <td>${row.MiddleName}</td>
            <td>${row.LastName}</td>
            <td>${row.BirthDate}</td>
            <td>${row.Sex}</td>
            <td>${row.ContactNumber}</td>
            <td>${row.Email}</td>
            <td>${row.Address}</td>
            <td>${row.role}</td>
          </tr>`;
  }

  tableTeachers += `
        </tbody>
      </table>
    </div>`;


  callback(tableTeachers);
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




module.exports = app;