export const downloadCsv = ({ incidents = [], selectedStation, fromMonth, fromYear, toMonth, toYear }) => {
    if (!incidents.length) {
        // use your toast system if needed
        try { window?.toast?.warning?.('No data in selected range to export.'); } catch { }
        return;
    }
    const headers = ['IncidentId', 'Station', 'Location', 'Status', 'TriggeredAt'];
    const rows = incidents.map((inc) => [
        inc.id,
        (inc.station?.name || '').replace(/,/g, ' '),
        (inc.station?.location || '').replace(/,/g, ' '),
        inc.status || '',
        new Date(inc.triggeredAt).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const label = selectedStation ? `station-${selectedStation}-` : '';
    a.href = url;
    a.download = `incidents-${label}${fromYear}-${String(fromMonth).padStart(2, '0')}_to_${toYear}-${String(toMonth).padStart(2, '0')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};