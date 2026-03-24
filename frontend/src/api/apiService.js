// src/api/apiService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5260/api';

// Create axios instance (NO global Content-Type)
const api = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true, // enable only if your server uses cookies
});

// Add auth token to requests (only if present)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Helper for query strings
const buildQuery = (params = {}) =>
    Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');

// ---------- Auth ----------
export const authAPI = {
    register: (data) =>
        api.post('/Auth/register', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
    login: (data) =>
        api.post('/Auth/login', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
};

// ---------- Users (Admin-only) ----------
export const userAPI = {
    getAll: () => api.get('/Users'),
    create: (data) =>
        api.post('/Users', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
    delete: (id) => api.delete(`/Users/${id}`),
};

// ---------- Stations ----------
export const stationAPI = {
    // Admin/Protected: full list used by dashboard
    getAll: () => api.get('/Station/stations'),

    // ✅ PUBLIC: all stations (active + inactive) for Public E‑Stop
    getPublicStations: () => api.get('/Station/public-stations'),

    // ✅ PUBLIC: non-closed incidents for Public E‑Stop labeling (Pressed/Open)
    getPublicOpenIncidents: (stationId) =>
        api.get(
            `/Station/public-open-incidents${stationId ? `?stationId=${encodeURIComponent(stationId)}` : ''
            }`
        ),

    // ✅ PUBLIC: only active stations (kept for other views; PublicEStop should prefer getPublicStations)
    getActive: () => api.get('/Station/active-stations'),

    // ✅ PUBLIC: E-Stop trigger (anonymous)
    pressEStop: (stationId) => {
        const qs = buildQuery({ stationId });
        return api.post(`/Station/press-estop?${qs}`);
    },

    // Admin/Protected CRUD for stations
    create: (data) =>
        api.post('/Station/create-station', data, {
            headers: { 'Content-Type': 'application/json' },
        }),
    update: (id, data) =>
        api.put(`/Station/update-station/${id}`, data, {
            headers: { 'Content-Type': 'application/json' },
        }),
    delete: (id) => api.delete(`/Station/delete-station/${id}`),
    remove: (id) => api.delete(`/Station/delete-station/${id}`), // alias

    // Admin/Protected station ops
    toggleStatus: (id) => api.put(`/Station/toggle-station-status/${id}`),
    toggle: (id) => api.put(`/Station/toggle-station-status/${id}`), // alias

    // Admin/Protected incidents/alerts/stats
    getAlerts: () => api.get('/Station/alerts'),
    acknowledge: (incidentId, body) =>
        api.post(
            `/Station/acknowledge?incidentId=${encodeURIComponent(incidentId)}`,
            body ?? {}, // expects: { issue: '...', comment?: '...' }
            { headers: { 'Content-Type': 'application/json' } }
        ),

    closeIncident: (incidentId, body) =>
        api.post(
            `/Station/close-incident?incidentId=${encodeURIComponent(incidentId)}`,
            body ?? {}, // expects: { comment?: '...' }
            { headers: { 'Content-Type': 'application/json' } }
        ),
    reset: (incidentId) =>
        api.post(`/Station/reset?incidentId=${encodeURIComponent(incidentId)}`),

    getDashboardStats: () => api.get('/Station/dashboard-stats'),
    getRecentIncidents: () => api.get('/Station/recent-incidents'),
    getStationStatus: () => api.get('/Station/station-status'),

    getIncidents: (status) =>
        api.get(
            `/Station/incidents${status ? `?status=${encodeURIComponent(status)}` : ''}`
        ),

    getMonthlyReport: (month, year) =>
        api.get(`/Station/monthly-report?${buildQuery({ month, year })}`),

    getStationReport: (stationId, month, year) => {
        const qs = buildQuery({ stationId, month, year });
        return api.get(`/Station/station-report?${qs}`);
    },

    getChartData: () => api.get('/Station/chart-data'),

    downloadReport: ({
        stationId,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        month,
        year,
        fromDate, // YYYY-MM-DD
        toDate,   // YYYY-MM-DD
    } = {}) => {
        const qs = buildQuery({
            stationId,
            fromMonth,
            fromYear,
            toMonth,
            toYear,
            month,
            year,
            fromDate, // new
            toDate,   // new
        });
        const url = qs ? `/Station/download-report?${qs}` : '/Station/download-report';
        return api.get(url, { responseType: 'blob' });
    },
};

export default stationAPI;