import React from 'react';

const IncidentsList = ({ incidents, formatDateTime, onAcknowledge, onClose }) => {
    if (incidents.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 11.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <p className="text-lg">No active incidents. All systems operational!</p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {incidents.map((incident) => (
                <div key={incident.id} className="border-2 border-red-400 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">{incident.station?.name}</h4>
                            <p className="text-gray-600 text-sm">{incident.station?.location}</p>
                            <div className="mt-2 space-y-1">
                                <p className="text-sm">
                                    <span className="font-medium">Time:</span> {formatDateTime(incident.triggeredAt)}
                                </p>
                                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                                    {incident.status === 'Open' ? 'Waiting for Acknowledgment' : incident.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                            <button onClick={() => onAcknowledge(incident.id)} className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">
                                Acknowledge
                            </button>
                            <button onClick={() => onClose(incident.id)} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IncidentsList;