require('dotenv').config();
const pool = require('./database');
const express = require("express");

const app = express();





// Logout endpoint
app.get("/logout", (req, res) => {
    // req.session.destroy();
    res.redirect("/admin");
});

//ADMIN LOGIN
app.post("/adminLogin", (req, res) => {
    const { username, pass } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection: ', err);
            res.status(500).send("Server error");
            return;
        }

        const adminQuery = `SELECT * FROM admin WHERE username = '${username}' AND pass = '${pass}'`;

        new Promise((resolve, reject) => {
            connection.query(adminQuery, (err, adminResult) => {
                if (err) reject(err);
                else resolve(adminResult);
            });
        }).then((adminResult) => {
            if (adminResult.length > 0) {
                // Login as an admin
                res.redirect("/adminDash");
            } else {
                // No matching admin found
                res.redirect("/admin?error=invalid");
            }
        }).catch((err) => {
            console.error('Error executing MySQL query: ', err);
            res.status(500).send("Server error");
        }).finally(() => {
            // Release the connection back to the pool
            connection.release();
        });
    });
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

        const userQuery = `SELECT * FROM enrolledstudents WHERE student_number = '${username}' AND password = '${pass}'`;

        Promise.all([
            new Promise((resolve, reject) => {
                connection.query(userQuery, (err, userResult) => {
                    if (err) reject(err);
                    else resolve(userResult);
                });
            }),
        ]).then(([userResult, adminResult, teacherResult]) => {
            if (userResult.length > 0) {
                // Login as a regular user
                res.redirect("/dashboard");
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


module.exports = app;