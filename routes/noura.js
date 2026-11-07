// Routes for: (write the pages here)
module.exports = function (app, dbCon) {

  // get support tickets 
  app.get("/api/tickets/:org_id", (req, res) => {
    const sql = "SELECT * FROM tickets WHERE org_id = ?"; 
    dbCon.query(sql, [req.params.org_id], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      res.json(results);
    });
  });

  // add your app.get / app.post / app.put / app.delete here

  // get messsages for an organization
  app.get("/api/messages/:org_id", (req, res) => {
    const sql = `SELECT messages.*, users.full_name AS sender_name, users.role AS sender_role
                  FROM messages
                  LEFT JOIN users ON messages.user_id = users.user_id
                  WHERE messages.org_id = ? 
                  ORDER BY messages.created_at ASC
                  `; 
    dbCon.query(sql, [req.params.org_id], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      res.json(results);
    });
  });

  // get the account manager for an organization
  app.get("/api/account-manager/:org_id", (req, res) => {
    const sql = ` SELECT users.full_name
                  FROM organizations
                  JOIN users ON organizations.manager_id = users.user_id
                  WHERE organizations.org_id = ?`;

                  dbCon.query(sql, [req.params.org_id], (err, results) => {
                    if (err) {
                      return res.status(500).send("Database error");
                    }
                    if (results.length === 0) {
                      return res.status(404).send("Account manager not found");
                    }
                    res.json(results[0]);
                  });
  });

  // send a new message
  app.post("/api/messages", (req, res) => {
    const { user_id, org_id, message } = req.body;

    console.log("Recieved message:", req.body);

    if (!user_id || !org_id || !message || !message.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const sql = `INSERT INTO messages (user_id, org_id, message, created_at) VALUES (?, ?, ?, NOW())`;

    dbCon.query(sql, [user_id, org_id, message.trim()], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      res.status(201).json({ message: "Message sent successfully", message_Id: result.insertId });
    });
  });

  // create a support ticket
  app.post("/api/tickets", (req, res) => {
    const { org_id, subject } = req.body;
    if (!org_id || !subject || !subject.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const sql = `INSERT INTO tickets (org_id, subject, status, created_at) VALUES (?, ?, 'Open', NOW())`;

    dbCon.query(sql, [org_id, subject.trim()], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      res.status(201).json({ message: "Ticket created successfully", ticket_Id: result.insertId });
    });
  });

  // get setup steps for the logged-in organization
  app.get("/api/setup-steps/:org_id", (req, res) => {
    const org_id = req.params.org_id;
    const sql = "SELECT * FROM setup_steps WHERE org_id = ? ORDER BY step_number ASC";
    dbCon.query(sql, [org_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });

  // get organization details for the logged-in user
  app.get("/api/organization/:org_id", (req, res) => {
    const org_id = req.params.org_id;

    const sql = "SELECT name, plan FROM organizations WHERE org_id = ?";

    dbCon.query(sql, [org_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(results[0]);
    });
  });

  // update a support ticket subject
  app.put("/api/tickets/:ticket_id", (req, res) => {
    const ticket_id = req.params.ticket_id;
    const { org_id, subject } = req.body;
    if (!org_id || !subject || !subject.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const sql = `UPDATE tickets SET subject = ? WHERE ticket_id = ? AND org_id = ?`; 

    dbCon.query(sql, [subject.trim(), ticket_id, org_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json({ message: "Ticket updated successfully" });
    });
  });

  // delete a support ticket
  app.delete("/api/tickets/:ticket_id", (req, res) => {
    const ticket_id = req.params.ticket_id;
    const { org_id } = req.body;
    if (!org_id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const sql = `DELETE FROM tickets WHERE ticket_id = ? AND org_id = ?`;

    dbCon.query(sql, [ticket_id, org_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json({ message: "Ticket deleted successfully" });
    });
  });

};