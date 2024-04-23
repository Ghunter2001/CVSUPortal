require('dotenv').config();
const express = require("express");
const fs = require("fs");
const pool = require('./database');

const app = express();



//TEACHER DASHBOARD TAB
app.get("/teacherDash.html", function (req, res) {
  res.sendFile(__dirname + "/teacherDash.html");
});





module.exports = app;