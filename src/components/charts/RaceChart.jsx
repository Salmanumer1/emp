import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RaceChart({ employees }) {

  const raceCounts = {};

  employees.forEach((emp) => {
    const race = emp.race || "Unknown";

    raceCounts[race] = (raceCounts[race] || 0) + 1;
  });

  const data = Object.keys(raceCounts).map((race) => ({
    race,
    count: raceCounts[race],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="race" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#6610f2" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RaceChart;