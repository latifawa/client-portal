// Routes for: login, account, admin, index
module.exports = function (app, dbCon) {

  // get all organizations
  app.get("/data/organizations", (req, res) => {
    let sqlQuery = "SELECT * FROM organizations";
    dbCon.query(sqlQuery, (error, results) => {
      if (error) throw error;
      res.send(results);
    });
  });

  // LOGIN: check the email and password in the users table
  app.post("/data/login", (req, res) => {
    // validation: both fields must be filled
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ success: false, message: "Please enter your email and password" });
    }

    let sqlQuery = `SELECT users.user_id, users.org_id, users.full_name, users.role,
                           organizations.name AS org_name, organizations.plan
                    FROM users
                    LEFT JOIN organizations ON users.org_id = organizations.org_id
                    WHERE users.email = ? AND users.password = ?`;
    dbCon.query(sqlQuery, [req.body.email, req.body.password], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      // no user with this email and password
      if (results.length == 0) {
        return res.status(401).send({ success: false, message: "Wrong email or password" });
      }
    
      // remember when this person last logged in
      dbCon.query("UPDATE users SET last_active = CURDATE() WHERE user_id = ?", [results[0].user_id]);
      // found: send back who logged in (without the password)
      res.status(200).send({ success: true, data: results[0] });
    });
  });


    // ACCOUNT: get one user's profile + their organization
  app.get("/data/account/:userId", (req, res) => {
    let sqlQuery = `SELECT users.full_name, users.email, users.job_title, users.phone,
                           organizations.name AS org_name, organizations.sector,
                           organizations.plan, organizations.city
                    FROM users
                    LEFT JOIN organizations ON users.org_id = organizations.org_id
                    WHERE users.user_id = ?`;
    dbCon.query(sqlQuery, [req.params.userId], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      if (results.length == 0) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      res.status(200).send({ success: true, data: results[0] });
    });
  });

  // ACCOUNT: get all team members of one organization
  app.get("/data/team/:orgId", (req, res) => {
    let sqlQuery = "SELECT full_name, email, role, last_active FROM users WHERE org_id = ?";
    dbCon.query(sqlQuery, [req.params.orgId], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });

  // ACCOUNT: save the profile (UPDATE)
  app.put("/data/account/:userId", (req, res) => {
    // validation
    if (!req.body.full_name || req.body.full_name.length < 3) {
      return res.status(400).send({ success: false, message: "Full name must be at least 3 characters" });
    }
    if (!req.body.email) {
      return res.status(400).send({ success: false, message: "Work email is required" });
    }

    let sqlQuery = "UPDATE users SET full_name = ?, email = ?, job_title = ?, phone = ? WHERE user_id = ?";
    let values = [req.body.full_name, req.body.email, req.body.job_title, req.body.phone, req.params.userId];

    dbCon.query(sqlQuery, values, (error, results) => {
      if (error) {
        // the email column is UNIQUE: two people can't have the same email
        if (error.code == "ER_DUP_ENTRY") {
          return res.status(400).send({ success: false, message: "This email is already used by another account" });
        }
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, message: "Your profile was saved" });
    });
  });

    // ADMIN → CLIENTS: every organization + how many setup steps are done
  app.get("/data/admin/clients", (req, res) => {
    let sqlQuery = `SELECT organizations.org_id, organizations.name, organizations.plan,
                      (SELECT COUNT(*) FROM setup_steps
                       WHERE setup_steps.org_id = organizations.org_id
                       AND setup_steps.status = 'Done') AS steps_done,
                      (SELECT COUNT(*) FROM setup_steps
                       WHERE setup_steps.org_id = organizations.org_id) AS total_steps
                    FROM organizations`;
    dbCon.query(sqlQuery, (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });

    // ADMIN → CLIENTS: mark a client's next setup step as done
  app.put("/data/admin/clients/:orgId/next-step", (req, res) => {
    let sqlQuery = `UPDATE setup_steps SET status = 'Done', completed_at = CURDATE()
                    WHERE org_id = ? AND status != 'Done'
                    ORDER BY step_number LIMIT 1`;
    dbCon.query(sqlQuery, [req.params.orgId], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      // nothing changed = every step was already done
      if (results.affectedRows == 0) {
        return res.status(400).send({ success: false, message: "This client has finished all steps" });
      }

      // the step after it becomes "In progress"
      let nextQuery = `UPDATE setup_steps SET status = 'In progress'
                       WHERE org_id = ? AND status = 'Not started'
                       ORDER BY step_number LIMIT 1`;
      dbCon.query(nextQuery, [req.params.orgId], () => {
        res.status(200).send({ success: true, message: "Step marked as done" });
      });
    });
  });
    // ADMIN → REQUESTS: requests that still need a decision
  app.get("/data/admin/requests", (req, res) => {
    let sqlQuery = `SELECT requests.request_id, organizations.name AS org_name,
                           requests.title, requests.created_at, requests.status
                    FROM requests
                    JOIN organizations ON requests.org_id = organizations.org_id
                    WHERE requests.status IN ('Pending', 'In progress')
                    ORDER BY requests.created_at DESC`;
    dbCon.query(sqlQuery, (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });

  // ADMIN → REQUESTS: save Ruba's decision (UPDATE)
  app.put("/data/admin/requests/:requestId", (req, res) => {
    // validation: only the status words the site uses
    const allowed = ["Approved", "In progress", "Done", "Declined"];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).send({ success: false, message: "Please choose a valid decision" });
    }
    if (!req.body.note || req.body.note.trim().length < 3) {
      return res.status(400).send({ success: false, message: "Please write a short note for the client" });
    }

    let sqlQuery = "UPDATE requests SET status = ?, note = ? WHERE request_id = ?";
    dbCon.query(sqlQuery, [req.body.status, req.body.note.trim(), req.params.requestId], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      if (results.affectedRows == 0) {
        return res.status(404).send({ success: false, message: "Request not found" });
      }
      res.status(200).send({ success: true, message: "Decision saved" });
    });
  });

    // ADMIN → MESSAGES: all messages, newest first, with the client and sender names
  app.get("/data/admin/messages", (req, res) => {
    let sqlQuery = `SELECT messages.message_id, messages.org_id, organizations.name AS org_name,
                           users.full_name AS sender_name, users.role AS sender_role,
                           messages.message, messages.created_at
                    FROM messages
                    JOIN users ON messages.user_id = users.user_id
                    JOIN organizations ON messages.org_id = organizations.org_id
                    ORDER BY messages.created_at DESC`;
    dbCon.query(sqlQuery, (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });

  // ADMIN → MESSAGES: Ruba sends a reply (INSERT)
  app.post("/data/admin/messages", (req, res) => {
    // validation
    if (!req.body.org_id || !req.body.user_id) {
      return res.status(400).send({ success: false, message: "Please choose a client" });
    }
    if (!req.body.message || req.body.message.trim().length < 2) {
      return res.status(400).send({ success: false, message: "Please write your reply" });
    }

    let sqlQuery = "INSERT INTO messages (user_id, org_id, message) VALUES (?, ?, ?)";
    let values = [req.body.user_id, req.body.org_id, req.body.message.trim()];

    dbCon.query(sqlQuery, values, (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(201).send({ success: true, message: "Reply sent", id: results.insertId });
    });
  });

    // ADMIN → TICKETS: all tickets, newest first, with the client's name
  app.get("/data/admin/tickets", (req, res) => {
    let sqlQuery = `SELECT tickets.ticket_id, organizations.name AS org_name,
                           tickets.subject, tickets.status, tickets.created_at
                    FROM tickets
                    JOIN organizations ON tickets.org_id = organizations.org_id
                    ORDER BY tickets.created_at DESC`;
    dbCon.query(sqlQuery, (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      res.status(200).send({ success: true, data: results });
    });
  });

  // ADMIN → TICKETS: change a ticket's status (UPDATE)
  app.put("/data/admin/tickets/:ticketId", (req, res) => {
    // validation: only the status words the site uses
    const allowed = ["Open", "In progress", "Resolved"];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).send({ success: false, message: "Please choose a valid status" });
    }

    let sqlQuery = "UPDATE tickets SET status = ? WHERE ticket_id = ?";
    dbCon.query(sqlQuery, [req.body.status, req.params.ticketId], (error, results) => {
      if (error) {
        return res.status(500).send({ success: false, message: "Internal Server Error.." });
      }
      if (results.affectedRows == 0) {
        return res.status(404).send({ success: false, message: "Ticket not found" });
      }
      res.status(200).send({ success: true, message: "Ticket updated" });
    });
  });
};