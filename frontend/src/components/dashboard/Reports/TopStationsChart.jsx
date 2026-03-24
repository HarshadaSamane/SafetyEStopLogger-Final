import React, { useMemo } from 'react';
import { ResponsiveContainer,BarChart,Bar,CartesianGrid,XAxis,YAxis,Tooltip,Legend,} from 'recharts';


const TopStationsChart = ({
    data = [],
    allIncidents,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    enforceGlobal = true,
}) => {
    // compute top 5 from an incidents list
    const computeTopStations = (incidents = []) => {
        const byStationMap = new Map();

        (incidents || []).forEach((inc) => {
            const sname =
                inc?.station?.name ??
                inc?.station?.Name ??
                inc?.Station?.Name ??
                'Unknown';

            byStationMap.set(sname, (byStationMap.get(sname) || 0) + 1);
        });

        return Array.from(byStationMap.entries())
            .map(([stationName, count]) => ({ stationName, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    
    const dateOnlyIncidents = useMemo(() => {
        if (
            !enforceGlobal ||
            !Array.isArray(allIncidents) ||
            !fromMonth ||
            !fromYear ||
            !toMonth ||
            !toYear
        ) {
            return null;
        }

        const start = new Date(fromYear, fromMonth - 1, 1, 0, 0, 0, 0);
        const end = new Date(toYear, toMonth, 0, 23, 59, 59, 999);

        return allIncidents.filter((inc) => {
            const when = new Date(inc?.triggeredAt ?? inc?.TriggeredAt);
            if (Number.isNaN(when.getTime())) return false;
            return when >= start && when <= end;
        });
    }, [enforceGlobal, allIncidents, fromMonth, fromYear, toMonth, toYear]);

   
    const top5 = useMemo(() => {
        if (Array.isArray(dateOnlyIncidents)) {
            return computeTopStations(dateOnlyIncidents);
        }
        return (data || []).slice(0, 5);
    }, [dateOnlyIncidents, data]);

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Top 5 Stations</h4>

            {top5.length ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={top5}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stationName" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#F59E0B" name="Incidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-gray-500">No top-station data.</p>
            )}

         
        </div>
    );
};

export default TopStationsChart;