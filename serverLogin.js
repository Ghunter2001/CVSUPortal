const express = require("express");
// const bodyParser = require('body-parser');
// const session = require('express-session');
const { createPool } = require("mysql");


const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cvsuportal",
})

const app = express();

// // Middleware for parsing request bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// // Middleware for managing sessions
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true
// }));



app.get("/login.html", (req, res) => {

    // req.session.destroy();

    res.sendFile(__dirname + "/login.html");
});


// Logout endpoint
app.get("/logout", (req, res) => {
    res.redirect("/login.html");
});

// LOGIN PAGE
app.post("/login", (req, res) => {
    const { username, pass } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection: ', err);
            res.status(500).send("Server error");
            return;
        }

        // Query to check username and password in the "enrolledStudents" table
        const userQuery = `SELECT * FROM enrolledstudents WHERE student_number = '${username}' AND password = '${pass}'`;

        // Query to check username and password in the "admin" table
        const adminQuery = `SELECT * FROM admin WHERE username = '${username}' AND pass = '${pass}'`;

        // Query to check username and password in the "users" table
        const teacherQuery = `SELECT * FROM faculty WHERE username = '${username}' AND pass = '${pass}'`;

        // Execute all queries in parallel
        Promise.all([
            new Promise((resolve, reject) => {
                connection.query(userQuery, (err, userResult) => {
                    if (err) reject(err);
                    else resolve(userResult);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(adminQuery, (err, adminResult) => {
                    if (err) reject(err);
                    else resolve(adminResult);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(teacherQuery, (err, teacherResult) => {
                    if (err) reject(err);
                    else resolve(teacherResult);
                });
            })
        ]).then(([userResult, adminResult, teacherResult]) => {
            if (userResult.length > 0) {
                // Login as a regular user
                res.redirect("/dashboard");
            } else if (adminResult.length > 0) {
                // Login as an admin
                res.redirect("/adminDash");
            } else if (teacherResult.length > 0) {
                // Login as a teacher
                res.redirect("/teacherDash.html");
            } else {
                // No matching user found in any table
                res.redirect("/?error=1");
            }
        }).catch((err) => {
            console.error('Error executing MySQL queries: ', err);
            res.status(500).send("Server error");
        }).finally(() => {
            // Release the connection back to the pool
            connection.release();
        });
    });
});


app.post("/signup", (req, res) => {
    const { fname, lname, mname, bdate, Sex, cp, address, email, password } = req.body;
    const query = `INSERT INTO details_students (lname, fname, mname, bdate, Sex, cp, address, email, password) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [lname, fname, mname, bdate, Sex, cp, address, email, password];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error("Error signing up:", err);
            res.status(500).send("Server error");
        } else {
            console.log("Signup successful");
            res.send(`
          <script>
            alert("Signup successful!");
            window.location.href = "/login.html"; // Redirect to the login page after successful sign-up
          </script>
        `);
        }
    });
});




// //Signup Endpoint
// app.post("/signup", (req, res) => {
//     // Retrieve user data from the request body
//     const { fname, lname, course, year, section, email, password } = req.body;

//     // Create a connection pool and connect to the database
//     const connection = new sql.ConnectionPool(config);
//     connection.connect(function (err) {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Server error");
//         } else {
//             const request = new sql.Request(connection);
//             const query = `INSERT INTO dbo.users (fname, lname, course, year, section, email, password) 
//                        VALUES ('${fname}', '${lname}', '${course}', '${year}', '${section}', '${email}', '${password}')`;

//             request.query(query, (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send("Server error");
//                 } else {
//                     console.log("Signup successful");
//                     res.send(`
//               <script>
//                 alert("Signup successful!");
//                 window.location.href = "/login.html"; // Redirect to the login page after successful sign-up
//               </script>
//             `);
//                 }

//                 connection.close(); // Close the connection
//             });
//         }
//     });
// });




module.exports = app;