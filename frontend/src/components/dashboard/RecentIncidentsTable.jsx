import React from 'react';

export const RecentIncidentsTable = ({ recentIncidents, formatDateTime, resolveStationName, resolveStationLocation }) => {
    if (!recentIncidents?.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 11.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <p className="text-lg">No recent incidents. All systems operational!</p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Station</th>
                        <th className="py-2 pr-4">Status</th>
                    </tr>
                </thead>
                {/*<tbody>*/}
                {/*    {recentIncidents.map((inc) => {*/}
                {/*        const who = (resolveTriggeredBy(inc) || '').toString().trim();*/}
                {/*        const stationName = (resolveStationName(inc) || '').toString().trim();*/}
                {/*        const stationLocation = (resolveStationLocation(inc) || '').toString().trim();*/}
                {/*        return (*/}
                {/*            <tr key={inc.id} className="border-t">*/}
                {/*                <td className="py-2 pr-4">{formatDateTime(inc.triggeredAt)}</td>*/}
                {/*                <td className="py-2 pr-4">{stationName || '-'}</td>*/}
                {/*                <td className="py-2 pr-4">*/}
                {/*                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${inc.status === 'Open' ? 'bg-red-100 text-red-800' : inc.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>*/}
                {/*                        {inc.status === 'Open' ? 'Waiting for Acknowledgment' : inc.status}*/}
                {/*                    </span>*/}
                {/*                </td>*/}
                {/*            </tr>*/}
                {/*        );*/}
                {/*    })}*/}
                {/*</tbody>*/}


                <tbody>
                    {recentIncidents.map((inc) => {
                        //const who = (resolveTriggeredBy(inc) || '').toString().trim();
                        const stationName = (resolveStationName(inc) || '').toString().trim();
                        const stationLocation = (resolveStationLocation(inc) || '').toString().trim();

                        return (
                            <tr
                                key={inc.id ?? `${stationName || 'unknown'}-${inc.triggeredAt ?? ''}-${Math.random()}`}
                                className="border-t"
                            >
                                <td className="py-2 pr-4">{formatDateTime(inc.triggeredAt)}</td>
                                <td className="py-2 pr-4">{stationName || '-'}</td>
                                <td className="py-2 pr-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${inc.status === 'Open'
                                                ? 'bg-red-100 text-red-800'
                                                : inc.status === 'Acknowledged'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        {inc.status === 'Open' ? 'Waiting for Acknowledgment' : inc.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RecentIncidentsTable;