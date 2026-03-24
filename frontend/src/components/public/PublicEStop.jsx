import React, { useState, useEffect, useMemo } from 'react';
import { stationAPI } from '../../api/apiService';
import { toast } from 'sonner';
import { AlertCircle, MapPin, Clock } from 'lucide-react';

const PublicEStop = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [triggeredBy, setTriggeredBy] = useState('');
    const [loading, setLoading] = useState(false);

    // Latest non-closed incident per station: { [stationId: string]: { incidentId, status, triggeredAt } }
    const [incidentMap, setIncidentMap] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [lastFetchedAt, setLastFetchedAt] = useState(null);

    // Live system clock
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        loadStations();
    }, []);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // Consistent, localized system time formatter
    // Treat plain "YYYY-MM-DDTHH:mm:ss" as UTC by appending 'Z' if no TZ provided
    const parseUtcDate = (val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
            const hasTZ = /Z|[+-]\d{2}:\d{2}$/.test(val);
            const s = hasTZ ? val : `${val}Z`;
            const d = new Date(s);
            return Number.isNaN(d.getTime()) ? null : d;
        }
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    // Localized formatter with explicit timezone name (e.g., IST)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const dateTimeFmt = useMemo(() => {
        const locale = navigator.language || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: tz,
            timeZoneName: 'short',
        });
    }, [tz]);

    const formatTime = (val) => {
        try {
            const d = parseUtcDate(val);
            return d ? dateTimeFmt.format(d) : '-';
        } catch {
            return '-';
        }
    };

    // Flexible boolean coercion
    const coerceBool = (defaultVal, ...vals) => {
        for (const v of vals) {
            if (typeof v === 'boolean') return v;
            if (typeof v === 'string') {
                const t = v.trim().toLowerCase();
                if (t === 'true') return true;
                if (t === 'false') return false;
            }
            if (typeof v === 'number') {
                if (v === 1) return true;
                if (v === 0) return false;
            }
        }
        return !!defaultVal;
    };

    // Load ALL stations (public), not only active
    const loadStations = async () => {
        try {
            const response = await stationAPI.getPublicStations();
            const raw = Array.isArray(response.data) ? response.data : [];

            const next = raw.map((s) => ({
                ...s,
                isActive: coerceBool(false, s.isActive, s.IsActive),
            }));

            setStations(next);

            if (selectedStation && !next.some(s => String(s.id ?? s.Id) === String(selectedStation))) {
                setSelectedStation('');
            }
        } catch (error) {
            console.error('loadStations error:', error?.response?.status, error?.response?.data || error);
            toast.error('Failed to load stations');
        }

        // Incidents refresh should not mask stations error
        try {
            await refreshIncidentMap();
        } catch (err) {
            console.error('refreshIncidentMap error:', err?.response?.status, err?.response?.data || err);
        }
    };

    // Refresh minimal non-closed incidents for label/status
    const refreshIncidentMap = async () => {
        try {
            setRefreshing(true);
            const res = await stationAPI.getPublicOpenIncidents();
            const list = Array.isArray(res.data) ? res.data : [];

            const map = {};
            list
                .filter((it) => it?.station?.Id || it?.Station?.Id || it?.station?.id)
                .filter((it) => {
                    const statusRaw = it.status ?? it.Status ?? '';
                    const status = String(statusRaw || '').toLowerCase();
                    return status && status !== 'closed';
                })
                .sort((a, b) => {

                    const aDate = parseUtcDate(a.triggeredAt ?? a.TriggeredAt);
                    const bDate = parseUtcDate(b.triggeredAt ?? b.TriggeredAt);
                    return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);

                })
                .forEach((it) => {
                    const sid = String(it?.station?.Id ?? it?.Station?.Id ?? it?.station?.id);
                    const status = String(it.status ?? it.Status ?? '').toLowerCase();
                    const tAt = it.triggeredAt ?? it.TriggeredAt;
                    if (!map[sid]) {
                        map[sid] = {
                            incidentId: it.id ?? it.Id,
                            status,
                            triggeredAt: tAt,
                        };
                    }
                });

            setIncidentMap(map);
            setLastFetchedAt(new Date());
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    // Current station state
    const currentState = selectedStation ? incidentMap[selectedStation] : null;
    const statusLower = String(currentState?.status || '').toLowerCase();
    const isOpen = statusLower === 'open';

    // Is the selected station currently active?
    const selectedStationObj = stations.find(s => String(s.id ?? s.Id) === String(selectedStation));
    const isStationActive = Boolean(selectedStationObj?.isActive ?? selectedStationObj?.IsActive);

    // Button can be pressed only when:
    // - not loading
    // - a station is selected
    // - the latest status is NOT OPEN
    // - the station is ACTIVE (per your new requirement)
    const canPress = !loading && !!selectedStation && !isOpen && isStationActive;

    // Optimistic local timestamp when user presses E-Stop
    const [optimisticPressedAt, setOptimisticPressedAt] = useState(null);
    const displayTriggeredAt = currentState?.triggeredAt ?? optimisticPressedAt ?? null;

    const handleEStopPress = async () => {
        if (!selectedStation) {
            toast.error('Please select a station');
            return;
        }

        if (!isStationActive) {
            toast.warning('This station is inactive. E‑STOP cannot be pressed.');
            return;
        }

        if (isOpen) {
            toast.warning('An incident is already active for this station.');
            return;
        }

        if (window.confirm('⚠️ Are you sure you want to press the E‑STOP button?')) {
            setLoading(true);
            const localPress = formatTime(displayTriggeredAt);
            setOptimisticPressedAt(localPress);

            try {
                await stationAPI.pressEStop(selectedStation, triggeredBy);
                toast.success('🚨 E‑STOP ACTIVATED! Incident reported successfully.');
                setTriggeredBy('');
                setOptimisticPressedAt(null);
                await refreshIncidentMap();
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || 'Failed to activate E‑Stop');
                setOptimisticPressedAt(null);
            } finally {
                setLoading(false);
            }
        }
    };

    // Button size that always fits the viewport partition
    const btnSize = 'clamp(180px, 50vh, 360px)';

    return (
        <div className="h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 overflow-hidden">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-5 flex items-center justify-center gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
                    <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Emergency E‑Stop</h1>
                    <p className="text-gray-600 text-l mb-2">Select a station and press the button</p>
                </div>
            </div>

            {/* Two partitions */}
            <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LEFT: Input / Status panel */}
                <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col">
                    <div className="space-y-4">
                        {/* Station Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                Select Station
                            </label>
                            <select
                                value={selectedStation}
                                onChange={(e) => setSelectedStation(e.target.value)}
                                className="w-full px-3 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">-- Choose a Station --</option>
                                {stations.map((station) => {
                                    const isActiveFlag = coerceBool(true, station.isActive, station.IsActive);
                                    const name = station.name ?? station.Name ?? '—';
                                    const location = station.location ?? station.Location ?? '—';
                                    const label = `${name} - ${location}${isActiveFlag ? '' : ' (Inactive)'}`;
                                    const value = String(station.id ?? station.Id);
                                    return (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Optional Name */}
                        {/*<div>*/}
                        {/*    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name (Optional)</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        value={triggeredBy}*/}
                        {/*        onChange={(e) => setTriggeredBy(e.target.value)}*/}
                        {/*        placeholder="Enter your name"*/}
                        {/*        className="w-full px-3 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500"*/}
                        {/*    />*/}
                        {/*</div>*/}

                        {/* Status Row (with Refresh button inline) */}
                        {selectedStation && (
                            <div className="flex flex-wrap items-center justify-around gap-4">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isOpen
                                                ? 'bg-red-100 text-red-700'
                                                : isStationActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {isOpen
                                            ? 'OPEN (Waiting for Acknowledgement)'
                                            : isStationActive
                                                ? 'AVAILABLE TO PRESS'
                                                : 'STATION INACTIVE'}
                                    </span>

                                    {displayTriggeredAt && isOpen && (
                                        <div className="flex items-center text-gray-500 text-xs md:text-sm">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Triggered at: {formatTime(displayTriggeredAt)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center mt-2">
                                    <button
                                        onClick={refreshIncidentMap}
                                        disabled={refreshing}
                                        className="text-xs md:text-sm px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        title="Refresh status"
                                    >
                                        {refreshing ? 'Refreshing…' : 'Refresh Status'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Safety note */}
                        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 text-center">
                            <p className="text-yellow-800 text-sm font-medium">
                                ⚠️ Only press this button in case of a genuine emergency!
                            </p>
                        </div>

                        {/* Footer info */}
                        <div className="text-center space-y-1">
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                ← Back to Login
                            </a>
                            {lastFetchedAt && (
                                <div className="text-xs text-gray-500">Status last checked: {formatTime(lastFetchedAt)}</div>
                            )}
                            <div className="text-xs text-gray-500">Current time: {formatTime(now)}</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: E‑STOP Button panel */}
                <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        {/* Pulsing halo when OPEN */}
                        {isOpen && (
                            <div
                                className="absolute rounded-full bg-red-400/30 animate-ping"
                                style={{ width: `calc(${btnSize} * 1.1)`, height: `calc(${btnSize} * 1.1)` }}
                            />
                        )}

                        <button
                            onClick={handleEStopPress}
                            aria-pressed={isOpen}
                            disabled={!canPress}
                            className={[
                                'relative rounded-full select-none',
                                'transition-all duration-200 ease-out focus:outline-none',
                                'disabled:cursor-not-allowed',
                                isOpen
                                    ? 'bg-red-700 shadow-inner ring-4 ring-red-500/50 text-white'
                                    : isStationActive
                                        ? 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0_20px_40px_-15px_rgba(220,38,38,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.75)] hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 text-gray-600',
                            ].join(' ')}
                            style={{ width: btnSize, height: btnSize }}
                            title={
                                !selectedStation
                                    ? 'Please select a station'
                                    : isOpen
                                        ? 'Incident already active'
                                        : !isStationActive
                                            ? 'Station inactive'
                                            : 'Press to trigger E‑Stop'
                            }
                        >
                            {!isOpen && isStationActive && (
                                <div className="absolute inset-3 rounded-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                            )}

                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mb-1.5" />
                                <span className="text-lg md:text-xl font-extrabold tracking-wide">
                                    {loading
                                        ? '⏳ ACTIVATING…'
                                        : isOpen
                                            ? '🚨 PRESSED 🚨'
                                            : isStationActive
                                                ? '🚨 PRESS E‑STOP 🚨'
                                                : 'INACTIVE'}
                                </span>
                                {!isOpen && isStationActive && (
                                    <span className="mt-0.5 text-[11px] opacity-80">Hold for emergencies only</span>
                                )}
                            </div>

                            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 pointer-events-none" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicEStop;
