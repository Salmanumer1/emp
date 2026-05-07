import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function GenderChart({ employees }) {

  const male = employees.filter(
    (e) => e.gender === "Male"
  ).length;

  const female = employees.filter(
    (e) => e.gender === "Female"
  ).length;

  const data = [
    {
      gender: "Male",
      count: male,
    },
    {
      gender: "Female",
      count: female,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="gender" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#0d6efd" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GenderChart;