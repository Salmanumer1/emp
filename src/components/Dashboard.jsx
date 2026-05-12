import { useEffect, useState } from "react";

import GenderChart from "../components/charts/GenderChart";
import RaceChart from "../components/charts/RaceChart";
import HireChart from "../components/charts/HireChart";
import LocationPie from "../components/charts/LocationPie";
import USMap from "../components/maps/USMap";
import practice from "./charts/practice";

function Dashboard() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    fetch("http://localhost:5000/api/employees")
      .then((r) => r.json())
      .then((d) => {

        if (d.success) {
          setEmployees(d.data);
        } else {
          setError(d.message);
        }

        setLoading(false);

      })
      .catch(() => {

        setError("Cannot connect to server");
        setLoading(false);

      });

  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const maleCount =
    employees.filter(
      (e) => e.gender === "Male"
    ).length;

  const femaleCount =
    employees.filter(
      (e) => e.gender === "Female"
    ).length;

  const remoteCount =
    employees.filter(
      (e) => e.location === "Remote"
    ).length;

  const headquartersCount =
    employees.filter(
      (e) => e.location === "Headquarters"
    ).length;

  return (

    <div className="container-fluid p-4 bg-light">

      <h1 className="mb-4">
        HR Analytics Dashboard
      </h1>

      {/* CARDS */}
      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h6>Total Employees</h6>
            <h2>{employees.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h6>Male</h6>
            <h2>{maleCount}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h6>Female</h6>
            <h2>{femaleCount}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h6>Remote</h6>
            <h2>{remoteCount}</h2>
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div className="row mb-4">

        <div className="col-lg-4">
          <div className="card shadow p-3">
            <h5>Location Distribution</h5>

            <LocationPie
              remote={remoteCount}
              headquarters={headquartersCount}
            />

          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow p-3">
            <h5>Hiring Trend</h5>

            <HireChart employees={employees} />

          </div>
        </div>

      </div>

      {/* SECOND ROW */}
      <div className="row mb-4">

        <div className="col-lg-4">
          <div className="card shadow p-3">
            <h5>Gender Distribution</h5>

            <GenderChart employees={employees} />

          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow p-3">
            <h5>Race Distribution</h5>

            <RaceChart employees={employees} />

          </div>
        </div>

      </div>

      {/* MAP */}
      <div className="card shadow p-3 mb-4">

        <h5>Employee Map</h5>

        <USMap employees={employees} />

      </div>

      {/* TABLE */}
      <div className="card shadow">

  <div className="card-header bg-dark text-white">
    Employee Table
  </div>

  {/* ↓ Add maxHeight and overflowY here */}
  <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>

    <table className="table table-striped">

      <thead className="sticky-top table-dark">  {/* ↓ sticky header stays visible while scrolling */}
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Department</th>
          <th>Location</th>
          <th>City</th>
          <th>Age</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.emp_id}>
            <td>{emp.emp_id}</td>
            <td>{emp.first_name} {emp.last_name}</td>
            <td>{emp.gender}</td>
            <td>{emp.department}</td>
            <td>{emp.location}</td>
            <td>{emp.location_city}</td>
            <td>{emp.age}</td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>

</div>
</div>

  );
}

export default Dashboard;