import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "leaflet/dist/leaflet.css"; 
function HireChart({ employees }) {

  const yearCounts = {};

  employees.forEach((emp) => {

    if (!emp.hire_date) return;

    const year = new Date(emp.hire_date)
      .getFullYear();

    yearCounts[year] =
      (yearCounts[year] || 0) + 1;
  });

  const data = Object.keys(yearCounts).map(
    (year) => ({
      year,
      employees: yearCounts[year],
    })
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="employees"
          stroke="#0d6efd"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HireChart;