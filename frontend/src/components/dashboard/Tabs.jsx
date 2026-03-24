import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab, openIncidentCount = 0 }) => (
    <div className="inline-flex rounded-xl bg-white shadow p-1">
        {tabs.map((tab) => {
            const label = tab === 'Incidents' && openIncidentCount > 0 ? `Incidents (${openIncidentCount})` : tab;
            const active = activeTab === tab;
            return (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    {label}
                </button>
            );
        })}
    </div>
);

export default Tabs;