import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const IncidentsByStationChart = ({ data = [] }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Incidents by Station</h4>
        {data.length ? (
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stationName" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3B82F6" name="Incidents" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="text-gray-500">No station data available.</p>
        )}
    </div>
);

export default IncidentsByStationChart;