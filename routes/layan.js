// Routes for: (write the pages here)
module.exports = function (app, dbCon) {

  // get all organizations
  app.get("/data/organizations", (req, res) => {
    let sqlQuery = "SELECT * FROM organizations";
    dbCon.query(sqlQuery, (error, results) => {
      if (error) throw error;
      res.send(results);
    });
  });

  // login: check the email and password in the users table
  app.post("/data/login", (req, res) => {
    // validation: both fields must be filled
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ success: false, message: "Please enter your email and password" });
    }

    let sqlQuery = "SELECT user_id, org_id, full_name, role FROM users WHERE email = ? AND password = ?";
    dbCon.query(sqlQuery, [req.body.email, req.body.password], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      // no user with this email and password
      if (results.length == 0) {
        return res.status(401).send({ success: false, message: "Wrong email or password" });
      }
      // found: send back who logged in (without the password)
      res.status(200).send({ success: true, data: results[0] });
    });
  });

};