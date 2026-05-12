import { PieChart,Pie,Cell,ResponsiveContainer,Tooltip,Line,LineChart,XAxis,YAxis,CartesianGrid,BarChart,Bar } from "recharts";

const practice=()=>{

    const data=[{
name:"Salman",
value:30
    },
{name:"Ahmad",value:70}];

return(
<>
<ResponsiveContainer>
    <PieChart>
        <Pie
        data={data}
        dataKey="value"
        label>
       {data.map((index)=> <Cell
        fill="red"></Cell>)}</Pie>
    </PieChart>
</ResponsiveContainer>
<ResponsiveContainer>
    <LineChart data={data}>
        <XAxis dataKey="value"/>
        <YAxis/>
        <Tooltip/>
        <Line type={"monotone"} dataKey="gender" stroke="red"
        />

    </LineChart>
</ResponsiveContainer>
<ResponsiveContainer>
    <BarChart data={data}>
        <XAxis dataKey="gender"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey=""value
        fill="red"/>

    </BarChart>
</ResponsiveContainer>
</>
);
}
export default practice;