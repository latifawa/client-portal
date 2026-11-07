// Routes for: (write the pages here)
module.exports = function (app, dbCon) {

  // add your app.get / app.post / app.put / app.delete here
  app.post("/data/requests", (req, res) => {
 
    // validation: the checks come first, before we touch the database
    if (!req.body.org_id || !req.body.user_id) {
      return res.status(400).send({ success: false, message: "Please log in first" });
    }
    if (!req.body.feature_id) {
      return res.status(400).send({ success: false, message: "Please choose a feature" });
    }
    if (!req.body.use_for || req.body.use_for.trim().length < 5) {
      return res.status(400).send({ success: false, message: "Please tell us what you will use it for (at least 5 characters)" });
    }
 
    // step 1: find the name of the chosen feature (it becomes the request title)
    let featureQuery = "SELECT feature_name FROM features WHERE feature_id = ?";
 
    dbCon.query(featureQuery, [req.body.feature_id], (error, features) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      
      if (features.length == 0) {
        return res.status(404).send({ success: false, message: "Feature not found" });
      }
 
      // step 2: request form for my requests & suggestions 
      let sqlQuery = `INSERT INTO requests
                        (org_id, user_id, feature_id, title, use_for, expected_users, start_date, priority, status, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`;
 
      let values = [
        req.body.org_id,
        req.body.user_id,
        req.body.feature_id,
        features[0].feature_name,
        req.body.use_for.trim(),
        req.body.expected_users,
        req.body.start_date || null,   // empty date -> NULL
        req.body.priority || "Normal"
      ];
 
      dbCon.query(sqlQuery, values, (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ success: false, message: "Internal Server Error.." });
        }
        res.status(201).send({ success: true, message: "Your request was sent", id: results.insertId });
      });
    });
  });
 
  // MY REQUESTS: the table of one organization's requests
  app.get("/data/requests/:org_id", (req, res) => {
 
    let orgId = req.params.org_id;
 
    let sqlQuery = `SELECT requests.request_id, requests.title, users.full_name AS sender_name,
                           requests.created_at, requests.status, requests.note
                    FROM requests
                    LEFT JOIN users ON requests.user_id = users.user_id
                    WHERE requests.org_id = ?
                    ORDER BY requests.created_at DESC, requests.request_id DESC`;
 
    dbCon.query(sqlQuery, [orgId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });
 
  // MY REQUESTS: the 4 summary numbers at the top of the page
  app.get("/data/requests/:org_id/summary", (req, res) => {
 
    let orgId = req.params.org_id;
 
    let sqlQuery = `SELECT SUM(status = 'Pending') AS waiting,
                           SUM(status = 'In progress') AS in_progress,
                           SUM(status IN ('Approved', 'Done')) AS approved_or_done,
                           SUM(status = 'Declined') AS declined
                    FROM requests
                    WHERE org_id = ?`;
 
    dbCon.query(sqlQuery, [orgId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
 
      // SUM gives null when there are no rows, so turn it into 0
      let row = results[0];
      res.status(200).send({
        success: true,
        data: {
          waiting: row.waiting || 0,
          in_progress: row.in_progress || 0,
          approved_or_done: row.approved_or_done || 0,
          declined: row.declined || 0
        }
      });
    });
  });
 
  // SUGGESTIONS: all the cards of one organization
  app.get("/data/suggestions/:org_id", (req, res) => {
 
    let orgId = req.params.org_id;
 
    let sqlQuery = "SELECT * FROM suggestions WHERE org_id = ? ORDER BY suggestion_id";
 
    dbCon.query(sqlQuery, [orgId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });
 
};
 
