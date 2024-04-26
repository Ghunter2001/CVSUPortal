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




app.get("/adminDash", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/adminDash.html");
});


app.get("/notice", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/Posting.html");
});



app.get("/enrollment", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/TEnrollment.html");
});


app.get("/schedule", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/TSchedule.html");
});


app.get("/acadyear", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MAcadyear.html");
});

app.get("/courses", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MCourses.html");
});

app.get("/sections", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MSection.html");
});

app.get("/subjects", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/MSubject.html");
});

app.get("/students", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/DataStudents.html");
});


app.get("/Archive", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/RArchive.html");
});

app.get("/requirements", function (req, res) {
  res.sendFile(__dirname + "/pages/admin/RReq.html");
});





app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/pages/landing/login.html");
});

app.get("/dashboard", function (req, res) {
  res.sendFile(__dirname + "/pages/students/dashboard.html");
});

app.get("/grades", function (req, res) {
  res.sendFile(__dirname + "/pages/students/grades.html");
});

app.get("/classSched", function (req, res) {
  res.sendFile(__dirname + "/pages/students/classSched.html");
});











//START SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})