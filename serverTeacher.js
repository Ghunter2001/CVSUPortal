const express = require("express");
const fs = require("fs");


const app = express();

const config = {
  server: "WIN-LKIRUI2ATS4\\SQLSTD2019",
  database: "accounts",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};


//TEACHER DASHBOARD TAB
app.get("/teacherDash.html", function (req, res) {
  res.sendFile(__dirname + "/teacherDash.html");
});





module.exports = app;