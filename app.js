const express = require("express");
const bodyParser =require("body-parser");


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public")); 

const updateRoutes = require("./Routes/update.routes")
app.use("/api/update-student", updateRoutes);

const userRoutes = require("./Routes/user.routes");
app.use("/api", userRoutes);

const courseRoutes =require("./Routes/course.routes");
app.use("/api/courses",courseRoutes)

const insertRoutes = require("./Routes/insert.routs");
app.use("/api/insert", insertRoutes);

const studentRoutes = require("./Routes/student.routes");
app.use("/api/students", studentRoutes);

const deletRoutes = require("./Routes/delete.routes")
app.use("/api/delete-student", deletRoutes);


module.exports = app