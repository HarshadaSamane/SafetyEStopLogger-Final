import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const IncidentsByDayChart = ({ data = [] }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Incidents by Day</h4>
        {data.length ? (
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#6366F1" name="Incidents" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="text-gray-500">No daily data available.</p>
        )}
    </div>
);

export default IncidentsByDayChart;