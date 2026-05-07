import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function LocationPie({ remote, headquarters }) {

  const data = [
    {
      name: "Remote",
      value: remote,
    },
    {
      name: "Headquarters",
      value: headquarters,
    },
  ];

  const COLORS = ["#fd7e14", "#0d6efd"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>
    </ResponsiveContainer>
  );
}

export default LocationPie;