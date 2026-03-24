import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const StatusPieChart = ({ data = [], colors = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'] }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Status Split</h4>
        {data.length ? (
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="status" label>
                            {data.map((_, i) => (
                                <Cell key={i} fill={colors[i % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="text-gray-500">No status data available.</p>
        )}
    </div>
);

export default StatusPieChart;