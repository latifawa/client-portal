const express = require('express');
const mysql = require('mysql2');
const Joi = require('joi');

const app = express();

// read data sent from forms and from fetch
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// show our website pages (the publichtml folder)
app.use(express.static(__dirname + "/publichtml"));

// connect to the database
const dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "humain_hub",
});

dbCon.connect((error) => {
  if (error) {
    console.log("Error Db: " + error.message);
    throw error;
  } else {
    console.log("Database is connected successfully...");
  }
});

// each team member's routes
require("./routes/layan")(app, dbCon);
require("./routes/joharah")(app, dbCon);
require("./routes/latifa")(app, dbCon);
require("./routes/noura")(app, dbCon);


// Listening...
app.listen(3000, () => console.log("Listening on port 3000"));