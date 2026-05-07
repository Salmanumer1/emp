// backend/controllers/employeeController.js
const xlsx = require("xlsx");
const path = require("path");
const db   = require("../db");

// ─────────────────────────────────────────
// STEP 1 — Read Excel and log to console
// ─────────────────────────────────────────
const readExcel = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads/file.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const data     = xlsx.utils.sheet_to_json(sheet);

    // STEP 2 — Log to console for debugging
    console.log("====== EXCEL DATA ======");
    console.log(`Total rows: ${data.length}`);
    console.log("First 2 rows:", JSON.stringify(data.slice(0, 2), null, 2));
    console.log("========================");

    // STEP 2 — Also send to browser so you can see it
    res.json({
      success : true,
      total   : data.length,
      message : "Check your console for debug logs",
      sample  : data.slice(0, 5),   // first 5 rows in browser
      data    : data,               // all rows
    });
  } catch (err) {
    console.error("Excel read error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// STEP 3A — Read Excel and save to MySQL
// ─────────────────────────────────────────
const importToMySQL = async (req, res) => {
  try {
    // 1. Read file
    const filePath = path.join(__dirname, "../uploads/file.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
    const rows     = xlsx.utils.sheet_to_json(sheet);
    const cleanRows = rows.map(row => {
  const cleaned = {};
  for (const key of Object.keys(row)) {
    const cleanKey = key.replace(/^\uFEFF/, ""); // removes hidden BOM character
    cleaned[cleanKey] = row[key];
  }
  return cleaned;
});

    console.log(`Importing ${rows.length} rows to MySQL...`);

    // 2. Clear old data
    await db.query("DELETE FROM file");

    // 3. Insert each row
    let inserted = 0;
    for (const row of rows) {
      const formatDate = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d) ? null : d.toISOString().split("T")[0];
      };

      await db.query(
        `INSERT INTO file
         (emp_id, first_name, last_name, birthdate, gender, race,
          department, jobtitle, location, hire_date, termdate,
          location_city, location_state, age)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          row.emp_id,
          row.first_name,
          row.last_name,
          formatDate(row.birthdate),
          row.gender,
          row.race,
          row.department,
          row.jobtitle,
          row.location,
          formatDate(row.hire_date),
          formatDate(row.termdate),
          row.location_city,
          row.location_state,
          row.age,
        ]
      );
      inserted++;

      // log progress every 100 rows
      if (inserted % 100 === 0) {
        console.log(`Inserted ${inserted}/${rows.length} rows...`);
      }
    }

    console.log(`Done! ${inserted} rows saved to MySQL`);
    res.json({ success: true, message: `${inserted} employees saved to MySQL` });

  } catch (err) {
    console.error("Import error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// STEP 3B — Fetch from MySQL → send to frontend
// ─────────────────────────────────────────
const getAllEmployees = async (req, res) => {
  try {
    console.log("Fetching employees from MySQL...");
    const [rows] = await db.query("SELECT * FROM file");
    console.log(`Fetched ${rows.length} rows from MySQL`);
    res.json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Stats for Tableau-style charts from MySQL
const getStats = async (req, res) => {
  try {
    const [gender]     = await db.query("SELECT gender, COUNT(*) as count FROM file GROUP BY gender");
    const [race]       = await db.query("SELECT race, COUNT(*) as count FROM file GROUP BY race");
    const [department] = await db.query("SELECT department, COUNT(*) as count FROM file GROUP BY department");
    const [location]   = await db.query("SELECT location, COUNT(*) as count FROM file GROUP BY location");
    const [yearly]     = await db.query("SELECT YEAR(hire_date) as year, COUNT(*) as count FROM file GROUP BY YEAR(hire_date) ORDER BY year");

    res.json({
      success    : true,
      gender,
      race,
      department,
      location,
      yearly,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    const {
      emp_id, first_name, last_name, birthdate, gender, race,
      department, jobtitle, location, hire_date, termdate,
      location_city, location_state, age,
    } = req.body;
 
    // Helper: parse date strings safely for MySQL
    const formatDate = (val) => {
      if (!val || val === "") return null;
      const d = new Date(val);
      return isNaN(d) ? null : d.toISOString().split("T")[0];
    };
 
    // Validate required fields
    const required = { emp_id, first_name, last_name, birthdate, gender, race,
                        department, jobtitle, location, hire_date, location_city,
                        location_state, age };
    for (const [key, val] of Object.entries(required)) {
      if (!val && val !== 0) {
        return res.status(400).json({ success: false, message: `${key} is required.` });
      }
    }
 
    // Age range check
    if (age < 18 || age > 65) {
      return res.status(400).json({ success: false, message: "Age must be between 18 and 65." });
    }
 
    await db.query(
      `INSERT INTO file
       (emp_id, first_name, last_name, birthdate, gender, race,
        department, jobtitle, location, hire_date, termdate,
        location_city, location_state, age)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        emp_id, first_name, last_name,
        formatDate(birthdate), gender, race,
        department, jobtitle, location,
        formatDate(hire_date), formatDate(termdate),
        location_city, location_state, age,
      ]
    );
 
    res.status(201).json({ success: true, message: `Employee ${first_name} ${last_name} saved.` });
 
  } catch (err) {
    console.error("Add employee error:", err.message);
 
    // MySQL duplicate entry error
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: `Employee ID ${req.body.emp_id} already exists.` });
    }
 
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { readExcel, importToMySQL, getAllEmployees, getStats, addEmployee};