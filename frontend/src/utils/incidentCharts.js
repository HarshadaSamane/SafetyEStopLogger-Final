// Shared utility to compute chart data from any incident list
export const computeIncidentCharts = (incidents = []) => {
  const byDayMap = new Map();
  const byStationMap = new Map();
  const statusMap = new Map();

  incidents.forEach((inc) => {
    const sname =
      inc?.station?.name ??
      inc?.station?.Name ??
      inc?.Station?.Name ??
      inc?.StationName ??
      "Unknown";
    const status = inc?.status ?? inc?.Status ?? "Unknown";

    const d = new Date(inc?.triggeredAt ?? inc?.TriggeredAt);
    if (!Number.isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      byDayMap.set(key, (byDayMap.get(key) || 0) + 1);
    }

    byStationMap.set(sname, (byStationMap.get(sname) || 0) + 1);
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  const incidentsByStation = Array.from(byStationMap.entries())
    .map(([stationName, count]) => ({ stationName, count }))
    .sort((a, b) => b.count - a.count);

  const statusSplit = Array.from(statusMap.entries()).map(
    ([status, value]) => ({ status, value }),
  );

  const incidentsByDay = Array.from(byDayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const topStations = incidentsByStation.slice(0, 5);

  return { incidentsByStation, statusSplit, incidentsByDay, topStations };
};

export const computeTopStations = (incidents = []) => {
  const byStationMap = new Map();
  (incidents || []).forEach((inc) => {
    const sname =
      inc?.station?.name ??
      inc?.station?.Name ??
      inc?.Station?.Name ??
      "Unknown";
    byStationMap.set(sname, (byStationMap.get(sname) || 0) + 1);
  });

  return Array.from(byStationMap.entries())
    .map(([stationName, count]) => ({ stationName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};
