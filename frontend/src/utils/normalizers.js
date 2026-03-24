export const safeStats = (raw) => {
    if (!raw || typeof raw !== 'object') {
        return { totalStations: 0, openIncidents: 0, closedIncidents: 0, totalIncidents: 0 };
    }
    return {
        totalStations: Number(raw.totalStations ?? raw.stationCount ?? 0),
        openIncidents: Number(raw.openIncidents ?? raw.activeIncidents ?? 0),
        closedIncidents: Number(raw.closedIncidents ?? 0),
        totalIncidents: Number(raw.totalIncidents ?? 0),
    };
};

export const normalizeChartData = (raw) => {
    if (!raw || typeof raw !== 'object') {
        return { incidentsByStation: [], statusSplit: [], incidentsByDay: [], topStations: [] };
    }
    const stationArr = raw.incidentsByStation || raw.byStation || raw.stations || [];
    const statusArr = raw.statusSplit || raw.byStatus || [];
    const byDayArr = raw.incidentsByDay || raw.byDay || [];
    const topArr = raw.topStations || raw.top || [];

    const normStations = (Array.isArray(stationArr) ? stationArr : [])
        .map((it) => ({
            stationName: it.stationName ?? it.station ?? it.name ?? it.StationName ?? it.Station ?? it.Name ?? '',
            count: Number(it.count ?? it.total ?? it.value ?? it.Count ?? it.Total ?? it.Value ?? 0),
        }))
        .filter((x) => x.stationName);

    const normStatus = (Array.isArray(statusArr) ? statusArr : [])
        .map((it) => ({
            status: it.status ?? it.name ?? it.Status ?? it.Name ?? '',
            value: Number(it.value ?? it.count ?? it.total ?? it.Value ?? it.Count ?? it.Total ?? 0),
        }))
        .filter((x) => x.status);

    const normByDay = (Array.isArray(byDayArr) ? byDayArr : [])
        .map((it) => ({
            date: it.date ?? it.day ?? it.Date ?? it.Day ?? '',
            count: Number(it.count ?? it.total ?? it.value ?? 0),
        }))
        .filter((x) => x.date);

    const normTop = (Array.isArray(topArr) ? topArr : [])
        .map((it) => ({
            stationName: it.stationName ?? it.station ?? it.name ?? '',
            count: Number(it.count ?? it.total ?? it.value ?? 0),
        }))
        .filter((x) => x.stationName);

    return { incidentsByStation: normStations, statusSplit: normStatus, incidentsByDay: normByDay, topStations: normTop };
};

export const computeOverviewFromIncidents = (incidentsList, daysWindow = 30) => {
    if (!Array.isArray(incidentsList)) {
        return { incidentsByStation: [], statusSplit: [], incidentsByDay: [], topStations: [] };
    }
    const now = new Date();
    const since = new Date(now);
    since.setDate(now.getDate() - daysWindow);
    const byStation = new Map();
    const byStatus = new Map();
    const byDay = new Map();

    incidentsList
        .filter((i) => i && i.triggeredAt)
        .forEach((i) => {
            const d = new Date(i.triggeredAt);
            if (Number.isNaN(d)) return;
            if (d < since) return;
            const stationName = i.station?.name || 'Unknown';
            byStation.set(stationName, (byStation.get(stationName) || 0) + 1);
            const status = i.status || 'Unknown';
            byStatus.set(status, (byStatus.get(status) || 0) + 1);
            const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            byDay.set(dayKey, (byDay.get(dayKey) || 0) + 1);
        });

    const incidentsByStation = Array.from(byStation, ([stationName, count]) => ({ stationName, count })).sort((a, b) => b.count - a.count);
    const statusSplit = Array.from(byStatus, ([status, value]) => ({ status, value }));
    const incidentsByDay = Array.from(byDay, ([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date));
    const topStations = incidentsByStation.slice(0, 5);

    return { incidentsByStation, statusSplit, incidentsByDay, topStations };
};