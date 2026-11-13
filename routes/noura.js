// Routes for: Support and Getting Started
module.exports = function (app, dbCon) {

  // get support tickets 
  app.get("/data/tickets/:org_id", (req, res) => {
    const sql = "SELECT * FROM tickets WHERE org_id = ? ORDER BY created_at DESC";    
    dbCon.query(sql, [req.params.org_id], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      res.json(results);
    });
  });

  // get messsages for an organization
  app.get("/data/messages/:org_id", (req, res) => {
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
  app.get("/data/account-manager/:org_id", (req, res) => {
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
  app.post("/data/messages", (req, res) => {
    const { user_id, org_id, message } = req.body;


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
  app.post("/data/tickets", (req, res) => {
    const { org_id, subject } = req.body;
    if (!org_id || !subject || !subject.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }
        if (subject.trim().length > 150) {
      return res.status(400).json({ error: "Please keep the problem under 150 characters" });
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
  app.get("/data/setup-steps/:org_id", (req, res) => {
    const org_id = req.params.org_id;
    const sql = "SELECT * FROM setup_steps WHERE org_id = ? ORDER BY step_number ASC";
    dbCon.query(sql, [org_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });

  // update a support ticket subject
  app.put("/data/tickets/:ticket_id", (req, res) => {
    const ticket_id = req.params.ticket_id;
    const { org_id, subject } = req.body;
    if (!org_id || !subject || !subject.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (subject.trim().length > 150) {
      return res.status(400).json({ error: "Please keep the problem under 150 characters" });
    }
    const sql = `UPDATE tickets SET subject = ? WHERE ticket_id = ? AND org_id = ? AND status = 'Open'`;
    dbCon.query(sql, [subject.trim(), ticket_id, org_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Ticket not found or already being handled by HUMAIN" });      }
      res.json({ message: "Ticket updated successfully" });
    });
  });

  // delete a support ticket
  app.delete("/data/tickets/:ticket_id", (req, res) => {
    const ticket_id = req.params.ticket_id;
    const { org_id } = req.body;
    if (!org_id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const sql = `DELETE FROM tickets WHERE ticket_id = ? AND org_id = ? AND status = 'Open'`;
    dbCon.query(sql, [ticket_id, org_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error"});
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Ticket not found or already being handled by HUMAIN" });      
      }
      res.json({ message: "Ticket deleted successfully" });
    });
  });

};