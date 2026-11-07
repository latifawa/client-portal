// Routes for: Dashboard and Catalog
module.exports = function (app, dbCon) {

  // add your app.get / app.post / app.put / app.delete here
  app.get("/data/features", (req, res) => {

    let sqlQuery = "SELECT * FROM features";

    dbCon.query(sqlQuery, (error, results) => {

      if (error) {
        console.log(error);
        return res.status(500).send("Database error");
      }

      res.send(results);

    });

  });

  // Get the organization's Dashboard numbers
app.get("/data/dashboard/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery = `
    SELECT
        organizations.fabric_users,
        organizations.data_sources,
        (
            SELECT COALESCE(SUM(usage_count), 0)
            FROM weekly_usage
            WHERE weekly_usage.org_id = organizations.org_id
            AND YEAR(week_start) = YEAR(CURDATE())
            AND MONTH(week_start) = MONTH(CURDATE())
        ) AS monthly_queries
    FROM organizations
    WHERE organizations.org_id = ?
`;
    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results[0]);
    });
});

// Count the features used by an organization
app.get("/data/feature-count/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery =
        "SELECT COUNT(*) AS total FROM org_features WHERE org_id = ?";

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results[0]);
    });
});

// Get weekly usage for one organization
app.get("/data/weekly-usage/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery =
        "SELECT week_start, usage_count FROM weekly_usage WHERE org_id = ? ORDER BY week_start";

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results);
    });
});

// Get the features used by one organization
app.get("/data/org-features/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery = `
        SELECT features.feature_name
        FROM org_features
        JOIN features
        ON org_features.feature_id = features.feature_id
        WHERE org_features.org_id = ?
    `;

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results);
    });
});

// Get setup progress for one organization
app.get("/data/setup-progress/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery = `
        SELECT step_name, status
        FROM setup_steps
        WHERE org_id = ?
        ORDER BY step_number
    `;

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results);
    });
});

// Get suggestions for one organization
app.get("/data/dashboard-suggestions/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery = `
        SELECT suggestion_id, title, details, link_page
        FROM suggestions
        WHERE org_id = ?
        ORDER BY suggestion_id
        LIMIT 2
    `;

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results);
    });
});

// Get pending feature requests for one organization
app.get("/data/pending-features/:org_id", (req, res) => {

    let orgId = req.params.org_id;

    let sqlQuery = `
        SELECT feature_id
        FROM requests
        WHERE org_id = ?
        AND status = 'Pending'
        AND feature_id IS NOT NULL
    `;

    dbCon.query(sqlQuery, [orgId], (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Database error");
        }

        res.send(results);
    });
});

};
