const express = require("express");
const login = require("./serverLogin");
const user = require("./serverUser");
const admin = require("./serverAdmin");
const teacher = require("./serverTeacher");



const app = express();
app.use("/css", express.static("css"));
app.use("/script", express.static("script"));
app.use("/img", express.static("img"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(login);
app.use(user);
app.use(admin);
app.use(teacher);


const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/landing/main.html");
});

app.get("/cvsuhym", (req, res) => {
  res.sendFile(__dirname + "/pages/landing/Cvsuhym.html");
});

app.get("/aboutmain", (req, res) => {
  res.sendFile(__dirname + "/pages/landing/about.html");
});


app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/pages/admin/login.html");
});





app.get("/stud", (req, res) => {
  res.sendFile(__dirname + "/pages/admission/login.html");
});









//START SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})