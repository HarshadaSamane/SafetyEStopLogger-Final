import React from 'react';
import DatePicker from 'react-datepicker';
import { Download, Loader2 } from 'lucide-react';

// Helpers: ISO <-> Date
const toISO = (d) => {
    if (!d || isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const fromISO = (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? null : dt;
};

const ReportsFilters = ({
    stations,
    selectedStation, setSelectedStation,

    // ISO dates in parent
    fromDate, setFromDate,
    toDate, setToDate,

    // (Optional) month/year for backend compatibility
    fromMonth, setFromMonth,
    fromYear, setFromYear,
    toMonth, setToMonth,
    toYear, setToYear,

    onDownload,
    loading,
    downloading,
}) => {
    // Convert ISO -> Date objects for the pickers
    const fromDt = React.useMemo(() => fromISO(fromDate), [fromDate]);
    const toDt = React.useMemo(() => fromISO(toDate), [toDate]);

    // Keep month/year synced whenever ISO changes
    const syncFromToMonthYear = (iso) => {
        if (!iso || !setFromMonth || !setFromYear) return;
        const [y, m] = iso.split('-').map(Number);
        if (Number.isFinite(y) && Number.isFinite(m)) {
            setFromYear(y);
            setFromMonth(m);
        }
    };
    const syncToToMonthYear = (iso) => {
        if (!iso || !setToMonth || !setToYear) return;
        const [y, m] = iso.split('-').map(Number);
        if (Number.isFinite(y) && Number.isFinite(m)) {
            setToYear(y);
            setToMonth(m);
        }
    };

    // From picker change
    const handleFromChange = (date) => {
        if (!date) return; // ignore clearing to keep stability
        const iso = toISO(date);
        setFromDate(iso);
        syncFromToMonthYear(iso);

        // If To is earlier than new From, bump To up to match From
        if (toDt && date > toDt) {
            const isoTo = toISO(date);
            setToDate(isoTo);
            syncToToMonthYear(isoTo);
        }
    };

    // To picker change
    const handleToChange = (date) => {
        if (!date) return; // ignore clearing
        // Ensure To >= From
        const min = fromDt || date;
        const final = date < min ? min : date;

        const iso = toISO(final);
        setToDate(iso);
        syncToToMonthYear(iso);
    };

    const isRangeInvalid = Boolean(fromDt && toDt && toDt < fromDt);
    const controlHeight = 'h-10';

    return (
        <>
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Station */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
                    <select
                        value={selectedStation}
                        onChange={(e) => setSelectedStation(e.target.value)}
                        className={`w-full px-3 border rounded-lg ${controlHeight}`}
                    >
                        <option value="">All Stations</option>
                        {stations.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* From Date (calendar) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <DatePicker
                        selected={fromDt}
                        onChange={handleFromChange}
                        selectsStart
                        startDate={fromDt}
                        endDate={toDt}
                        dateFormat="dd-MM-yyyy"
                        className={`w-full px-3 border rounded-lg ${controlHeight}`}
                        maxDate={toDt || undefined}
                        placeholderText="dd-mm-yyyy"
                        isClearable={false}
                    />
                </div>

                {/* To Date (calendar) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <DatePicker
                        selected={toDt}
                        onChange={handleToChange}
                        selectsEnd
                        startDate={fromDt}
                        endDate={toDt}
                        minDate={fromDt || undefined}
                        dateFormat="dd-MM-yyyy"
                        className={`w-full px-3 border rounded-lg ${controlHeight}`}
                        placeholderText="dd-mm-yyyy"
                        isClearable={false}
                    />
                </div>

                {/* Download Button */}
                <div className="flex md:items-end">
                    <button
                        onClick={onDownload}
                        className={`w-full md:w-auto bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700 inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed ${controlHeight}`}
                        disabled={downloading}
                        title={downloading ? 'Preparing report…' : 'Download Report'}
                    >
                        {downloading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Preparing…
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Validation hint */}
            {isRangeInvalid && (
                <p className="text-sm text-red-600 mb-4">“To” must be the same day or after “From”.</p>
            )}

            {/* Loading note */}
            {loading && <span className="text-sm text-gray-500">Loading incidents…</span>}
        </>
    );
};

export default ReportsFilters;