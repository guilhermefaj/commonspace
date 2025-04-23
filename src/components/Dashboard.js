import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Janeiro', investimento: 4000 },
  { name: 'Fevereiro', investimento: 3000 },
  { name: 'Março', investimento: 2000 },
  { name: 'Abril', investimento: 2780 },
  { name: 'Maio', investimento: 1890 },
];

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Dashboard - Investimento Social</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="investimento" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}