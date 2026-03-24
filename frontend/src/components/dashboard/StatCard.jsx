import React from 'react';

const StatCard = ({ title, value, icon, color = 'border-blue-500' }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            {icon}
        </div>
    </div>
);

export default StatCard;