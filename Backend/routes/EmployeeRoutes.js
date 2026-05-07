// backend/routes/employeeRoutes.js
const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/EmployeeController");
 const { addEmployee } = require("../controllers/employeeController");

// STEP 1+2 — Read Excel file and show in browser + console
router.get("/read-excel",   controller.readExcel);

// STEP 3A — Import Excel data into MySQL (run once)
router.get("/import",       controller.importToMySQL);

// STEP 3B — Get all employees from MySQL
router.get("/",             controller.getAllEmployees);

// Stats for charts
router.get("/stats",        controller.getStats);
router.post("/add", addEmployee);
module.exports = router;