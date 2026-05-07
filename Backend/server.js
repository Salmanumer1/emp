// backend/server.js
const express        = require("express");
const cors           = require("cors");
const employeeRoutes = require("./routes/EmployeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// All employee routes live under /api/employees
app.use("/api/employees", employeeRoutes);

app.listen(5000, () => {
  console.log("Server running → http://localhost:5000");
});