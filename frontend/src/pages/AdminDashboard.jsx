import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { stationAPI, userAPI } from "../api/apiService";
import "react-datepicker/dist/react-datepicker.css";

import EStopBanner from "../components/dashboard/EStopBanner";
import Tabs from "../components/dashboard/Tabs";
import Navbar from "../components/layout/Navbar";
import EditStationModal from "../components/modal/EditStationModal";
import UserManagement from "../components/layout/UserManagement";
import CloseIncidentModal from "../components/modal/CloseIncidentModal";
import Overview from "../components/layout/Overview";
import Reports from "../components/layout/Reports";
import Incidents from "../components/layout/Incidents";
import AcknowledgeModal from "../components/modal/AcknowledgeModal";

import {
  formatDateTime,
  resolveStationName,
  resolveStationLocation,
} from "../utils/dateTime";
import { downloadCsv } from "../utils/csv";
import { useAuth } from "../context/AuthContext";
import { useIncidentModal } from "../hooks/useIncidentModal";
import {
  computeIncidentCharts,
  computeTopStations,
} from "../utils/incidentCharts";

// Try several method names on an API object
const callFirstAvailable = async (obj, methodNames = [], ...args) => {
  for (const name of methodNames) {
    if (obj && typeof obj[name] === "function") return await obj[name](...args);
  }
  throw new Error(`No endpoint found. Tried: ${methodNames.join(", ")}`);
};

const parseUtcDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  const s =
    typeof val === "string" && !/Z|[+-]\d{2}:\d{2}$/.test(val)
      ? `${val}Z`
      : val;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const firstOfMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const role = user?.role;

  const isOperator = useMemo(
    () => String(role || "").toLowerCase() === "operator",
    [role],
  );

  const tabs = useMemo(() => {
    const r = String(role || "").toLowerCase();
    if (r === "admin") return ["Overview", "Incidents", "Reports"];
    if (isOperator) return ["Overview", "Incidents"];
    return ["Overview", "Incidents", "Reports"];
  }, [role, isOperator]);

  const deny = (msg = "You don't have permission to do that.") =>
    toast.error(msg);

  // Modal state via custom hook
  const ackModal = useIncidentModal({ issue: "", comment: "" });
  const closeModal = useIncidentModal({ comment: "" });

  // Core state
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [chartData, setChartData] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [showCreateStation, setShowCreateStation] = useState(false);
  const [newStation, setNewStation] = useState({ name: "", location: "" });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [stationLoading, setStationLoading] = useState({});
  const setLoadingById = (id, v) =>
    setStationLoading((p) => ({ ...p, [id]: v }));

  // Reports state
  const now = new Date();
  const [fromDate, setFromDate] = useState(firstOfMonthStr);
  const [toDate, setToDate] = useState(todayStr);
  const [fromMonth, setFromMonth] = useState(now.getMonth() + 1);
  const [fromYear, setFromYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth() + 1);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [allIncidents, setAllIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "Operator",
    password: "",
  });

  // Formatter
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const dateTimeFmt = useMemo(() => {
    return new Intl.DateTimeFormat(navigator.language || "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
      timeZoneName: "short",
    });
  }, [tz]);

  const location = useLocation();
  const navigate = useNavigate();

  // Redirect operator away from Reports
  useEffect(() => {
    if (isOperator && activeTab === "Reports") setActiveTab("Overview");
  }, [isOperator, activeTab]);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-refresh every 5s
  useEffect(() => {
    loadDashboardData();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") loadDashboardData();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Load all incidents for Reports tab
  useEffect(() => {
    if (activeTab !== "Reports" || isOperator) return;
    const load = async () => {
      try {
        setReportsLoading(true);
        const res = await stationAPI.getIncidents();
        setAllIncidents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setReportsLoading(false);
      }
    };
    load();
  }, [activeTab, isOperator]);

  // Filter incidents by date range + station
  useEffect(() => {
    if (!allIncidents?.length) {
      setFilteredIncidents([]);
      return;
    }

    const hasFullDates = Boolean(fromDate && toDate);
    const start = hasFullDates
      ? new Date(`${fromDate}T00:00:00`)
      : new Date(fromYear, fromMonth - 1, 1, 0, 0, 0, 0);
    const end = hasFullDates
      ? new Date(`${toDate}T23:59:59.999`)
      : new Date(toYear, toMonth, 0, 23, 59, 59, 999);

    setFilteredIncidents(
      allIncidents.filter((inc) => {
        const when = new Date(inc.triggeredAt ?? inc.TriggeredAt);
        if (Number.isNaN(when.getTime())) return false;
        const stationId =
          inc.station?.id ??
          inc.station?.Id ??
          inc.StationId ??
          inc.Station?.Id ??
          null;
        return (
          when >= start &&
          when <= end &&
          (selectedStation
            ? String(stationId) === String(selectedStation)
            : true)
        );
      }),
    );
  }, [
    allIncidents,
    selectedStation,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    fromDate,
    toDate,
  ]);

  // Handle ?view=users redirect for admins
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isAdmin = String(user?.role || "").toLowerCase() === "admin";
    if (searchParams.get("view") === "users" && isAdmin) {
      setActiveTab("Users");
      searchParams.delete("view");
      const cleaned = searchParams.toString();
      navigate(
        cleaned ? `${location.pathname}?${cleaned}` : location.pathname,
        { replace: true },
      );
    }
  }, [location, navigate, user]);

  // Date-only (no station filter) incidents for global top stations chart
  const dateOnlyIncidents = useMemo(() => {
    if (!allIncidents?.length) return [];
    const hasFullDates = Boolean(fromDate && toDate);
    const start = hasFullDates
      ? new Date(`${fromDate}T00:00:00`)
      : new Date(fromYear, fromMonth - 1, 1, 0, 0, 0, 0);
    const end = hasFullDates
      ? new Date(`${toDate}T23:59:59.999`)
      : new Date(toYear, toMonth, 0, 23, 59, 59, 999);
    return allIncidents.filter((inc) => {
      const when = new Date(inc.triggeredAt ?? inc.TriggeredAt);
      return !Number.isNaN(when.getTime()) && when >= start && when <= end;
    });
  }, [allIncidents, fromMonth, fromYear, toMonth, toYear, fromDate, toDate]);

  const topStationsGlobal = useMemo(
    () => computeTopStations(dateOnlyIncidents),
    [dateOnlyIncidents],
  );
  const chartLocal = useMemo(
    () => computeIncidentCharts(filteredIncidents),
    [filteredIncidents],
  );

  // Load users when Users tab active (admin only)
  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await userAPI.getAll();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Users" && String(role || "").toLowerCase() === "admin")
      loadUsers();
  }, [activeTab, role]);

  const filteredUsers = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    return (users || []).filter((u) => {
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesTerm =
        !term ||
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);
      return matchesRole && matchesTerm;
    });
  }, [users, userSearch, roleFilter]);

  // ── Dashboard data loader ──────────────────────────────────────────────────
  const loadDashboardData = async () => {
    const toNum = (v) => {
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isFinite(n) ? n : undefined;
    };
    const pick = (obj, keys) => {
      for (const k of keys) {
        const n = toNum(obj?.[k]);
        if (n !== undefined) return n;
      }
    };

    try {
      setLoading(true);
      const [
        statsRes,
        alertsRes,
        stationsRes,
        recentRes,
        allIncidentsRes,
        stationStatusRes,
      ] = await Promise.all([
        stationAPI.getDashboardStats(),
        stationAPI.getAlerts(),
        stationAPI.getAll(),
        stationAPI.getRecentIncidents().catch(() => ({ data: [] })),
        stationAPI.getIncidents().catch(() => ({ data: [] })),
        stationAPI.getStationStatus().catch(() => ({ data: [] })),
      ]);

      const stationsArr = Array.isArray(stationsRes?.data)
        ? stationsRes.data
        : [];
      const alertsArr = Array.isArray(alertsRes?.data) ? alertsRes.data : [];
      const all = Array.isArray(allIncidentsRes?.data)
        ? allIncidentsRes.data
        : [];
      const statusArr = Array.isArray(stationStatusRes?.data)
        ? stationStatusRes.data
        : [];

      // Historical incident count per station
      const countByStationId = new Map();
      for (const inc of all) {
        const sid =
          inc?.station?.id ??
          inc?.station?.Id ??
          inc?.StationId ??
          inc?.Station?.Id ??
          null;
        if (sid != null)
          countByStationId.set(
            String(sid),
            (countByStationId.get(String(sid)) || 0) + 1,
          );
      }

      // Station status merge
      const statusById = new Map(
        statusArr.map((s) => {
          const raw = s.latestIncidentStatus ?? s.LatestIncidentStatus ?? null;
          const latestStatus = typeof raw === "string" ? raw.trim() : raw;
          const isWaiting = String(latestStatus || "").toLowerCase() === "open";
          return [
            s.id ?? s.Id,
            {
              isInAlert: isWaiting,
              hasUnresolvedIncident: isWaiting,
              latestIncidentStatus: latestStatus,
            },
          ];
        }),
      );

      const stationsWithStatus = stationsArr.map((s) => {
        const st = statusById.get(s.id ?? s.Id) || {};
        return {
          ...s,
          isActive: s?.isActive ?? s?.IsActive ?? true,
          isInAlert: st.isInAlert ?? false,
          hasUnresolvedIncident: st.hasUnresolvedIncident ?? false,
          latestIncidentStatus: st.latestIncidentStatus ?? null,
          incidentCount: countByStationId.get(String(s.id ?? s.Id)) || 0,
        };
      });

      // Stats with fallback
      const sdata = statsRes?.data ?? {};
      let open = pick(sdata, [
        "openIncidents",
        "OpenIncidents",
        "Open",
        "open",
        "OpenCount",
        "OpenIncidentsCount",
        "TotalOpenIncidents",
      ]);
      let ack = pick(sdata, [
        "acknowledgedIncidents",
        "AcknowledgedIncidents",
        "Acknowledged",
        "acknowledged",
        "Ack",
        "AckCount",
        "AcknowledgedCount",
        "TotalAcknowledgedIncidents",
      ]);
      let closed = pick(sdata, [
        "closedIncidents",
        "ClosedIncidents",
        "Closed",
        "closed",
        "ClosedCount",
        "ClosedIncidentsCount",
        "TotalClosedIncidents",
      ]);
      let total = pick(sdata, [
        "totalIncidents",
        "TotalIncidents",
        "Incidents",
        "IncidentsCount",
        "Total",
      ]);

      if (
        open === undefined ||
        ack === undefined ||
        closed === undefined ||
        total === undefined
      ) {
        let o = 0,
          a = 0,
          c = 0;
        for (const inc of all) {
          const st = (inc?.status ?? inc?.Status ?? "")
            .toString()
            .toLowerCase();
          if (st === "open") o++;
          else if (["acknowledged", "ack", "acknowledge"].includes(st)) a++;
          else if (["closed", "close"].includes(st)) c++;
        }
        open = open ?? o;
        ack = ack ?? a;
        closed = closed ?? c;
        total = total ?? o + a + c;
      }

      setStats({
        totalStations:
          pick(sdata, [
            "totalStations",
            "TotalStations",
            "stationsCount",
            "StationsCount",
          ]) ?? stationsArr.length,
        openIncidents: open,
        acknowledgedIncidents: ack,
        closedIncidents: closed,
        totalIncidents: total,
      });

      setIncidents(alertsArr);
      setStations(stationsWithStatus);

      // Overview charts from last 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const last30 = all.filter((i) => {
        const d = parseUtcDate(i?.triggeredAt ?? i?.TriggeredAt);
        return d && d >= cutoff;
      });
      setChartData(computeIncidentCharts(last30));

      setRecentIncidents(Array.isArray(recentRes?.data) ? recentRes.data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleAcknowledge = (id) => {
    if (isOperator) {
      deny();
      return;
    }
    ackModal.open(id);
  };
  const handleClose = (id) => {
    if (isOperator) {
      deny();
      return;
    }
    closeModal.open(id);
  };

  const handleSubmitAcknowledge = async (e) => {
    e.preventDefault();
    if (!ackModal.incidentId) return;
    if (!ackModal.form.issue?.trim()) {
      toast.error("Please specify what the issue was about.");
      return;
    }
    try {
      ackModal.setSubmitting(true);
      await stationAPI.acknowledge(ackModal.incidentId, {
        issue: ackModal.form.issue.trim(),
        comment: ackModal.form.comment?.trim() ?? null,
      });
      toast.success("Incident acknowledged");
      ackModal.close();
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ?? "Failed to acknowledge incident",
      );
    } finally {
      ackModal.setSubmitting(false);
    }
  };

  const handleSubmitClose = async (e) => {
    e.preventDefault();
    if (!closeModal.incidentId) return;
    try {
      closeModal.setSubmitting(true);
      await stationAPI.closeIncident(closeModal.incidentId, {
        comment: closeModal.form.comment?.trim() ?? null,
      });
      toast.success("Incident closed");
      closeModal.close();
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message ?? "Failed to close incident");
    } finally {
      closeModal.setSubmitting(false);
    }
  };

  const handleCreateStation = async (e) => {
    e.preventDefault();
    const name = newStation.name?.trim() ?? "";
    const loc = newStation.location?.trim() ?? "";
    if (!name) {
      toast.warning("Station name is required");
      return;
    }

    const norm = (s) => (s ?? "").trim().toLowerCase();
    if (stations?.some((s) => norm(s.name) === norm(name))) {
      toast.error(`A station with the name "${name}" already exists`);
      return;
    }
    if (loc && stations?.some((s) => norm(s.location) === norm(loc))) {
      toast.error(`A station with the location "${loc}" already exists`);
      return;
    }

    try {
      await callFirstAvailable(stationAPI, ["create", "add", "post"], {
        name,
        location: loc,
      });
      toast.success("Station created");
      setNewStation({ name: "", location: "" });
      setShowCreateStation(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "";
      const code = err?.response?.data?.code;
      if (status === 409 || code?.startsWith("DUPLICATE")) {
        if (code === "DUPLICATE_NAME" || /name.*exist/i.test(msg)) {
          toast.error("A station with this name already exists");
          return;
        }
        if (code === "DUPLICATE_LOCATION" || /location.*exist/i.test(msg)) {
          toast.error("A station with this location already exists");
          return;
        }
        toast.error(
          "Duplicate station detected. Please change the name or location.",
        );
        return;
      }
      toast.error(msg || err.message || "Failed to create station");
    }
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    if (!editStation?.id) {
      toast.error("Missing station id");
      return;
    }
    try {
      await stationAPI.update(editStation.id, {
        name: editStation.name?.trim(),
        location: editStation.location?.trim(),
      });
      toast.success("Station updated");
      setShowEditModal(false);
      setEditStation(null);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ??
        err.message ??
        "Failed to update station",
      );
    }
  };

  const handleToggleStation = async (stationId) => {
    if (!stationId) return;
    try {
      setLoadingById(stationId, true);
      await stationAPI.toggleStatus(stationId);
      toast.success("Station status updated");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string"
          ? err.response.data
          : undefined) ??
        err?.message ??
        "Failed to update station status";
      toast.error(
        msg || "Station cannot be activated while incident is unresolved.",
      );
    } finally {
      setLoadingById(stationId, false);
    }
  };

  const handleDownloadFiltered = async () => {
    if (isOperator) {
      deny();
      return;
    }
    if (downloadingReport) return;
    setDownloadingReport(true);
    try {
      const res = await stationAPI.downloadReport({
        stationId: selectedStation || undefined,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        fromDate,
        toDate,
      });
      const blob = new Blob([res.data], {
        type:
          res.headers?.["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      let filename = `IncidentReport_${selectedStation || "AllStations"}_${fromDate || `${fromYear}-${String(fromMonth).padStart(2, "0")}`}_to_${toDate || `${toYear}-${String(toMonth).padStart(2, "0")}`}.xlsx`;
      const cd =
        res.headers?.["content-disposition"] ??
        res.headers?.get?.("content-disposition");
      if (cd) {
        const match = /filename\*?=(?:UTF-8''|")?([^;"]+)/i.exec(cd);
        if (match?.[1])
          filename = decodeURIComponent(match[1].replace(/"/g, "").trim());
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err) {
      console.error(err);
      toast.message("Server report unavailable, exporting CSV instead.");
      downloadCsv({
        incidents: filteredIncidents,
        selectedStation,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        fromDate,
        toDate,
      });
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      await callFirstAvailable(
        userAPI,
        [
          "changePassword",
          "updatePassword",
          "resetPasswordSelf",
          "setPassword",
        ],
        { currentPassword, newPassword },
      );
      toast.success("Password updated successfully");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string"
          ? err.response.data
          : undefined) ??
        err?.message ??
        "Failed to change password";
      toast.error(msg);
      throw err;
    }
  };

  const handleDeleteUser = async (id, userRole) => {
    if (userRole === "Admin") {
      toast.error("You cannot delete another Admin.");
      return;
    }
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await userAPI.delete(id);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 404) {
        toast.error("User not found on server (404). Try refreshing the list.");
        await loadUsers();
        return;
      }
      const msg =
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string"
          ? err.response.data
          : undefined) ??
        err?.message ??
        "Failed to delete user";
      toast.error(msg);
    }
  };

  const fmtDate = (d) => formatDateTime(d, dateTimeFmt);
  const openIncidentCount = incidents.length;
  const isAdmin = String(role || "").toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onManageUsers={() => {
          if (!isAdmin) {
            toast.error("Only admins can manage users.");
            return;
          }
          setActiveTab("Users");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onChangePassword={handleChangePassword}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Safety Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all stations and incidents
            </p>
          </div>
          <div>
            <Link
              to={"/public-estop"}
              className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white 
              font-semibold text-sm shadow-lg transition-all duration-150 ease-in-out hover:bg-red-700 active:scale-90 
              active:shadow-inner focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              <span>E-STOP</span>
              <span>Button</span>

            </Link>
          </div>
        </div>

        <div className="mb-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openIncidentCount={openIncidentCount}
          />
        </div>

        {openIncidentCount > 0 && (
          <EStopBanner
            count={openIncidentCount}
            onReview={() => setActiveTab("Incidents")}
          />
        )}

        {activeTab === "Overview" && (
          <Overview
            stats={stats}
            openIncidentCount={openIncidentCount}
            chartData={chartData}
            recentIncidents={recentIncidents}
            stations={stations}
            role={String(role || "").toLowerCase()}
            isOperator={isOperator}
            showCreateStation={showCreateStation}
            setShowCreateStation={setShowCreateStation}
            newStation={newStation}
            setNewStation={setNewStation}
            handleCreateStation={handleCreateStation}
            handleToggleStation={handleToggleStation}
            setEditStation={setEditStation}
            setShowEditModal={setShowEditModal}
            stationLoading={stationLoading}
            formatDateTime={fmtDate}
            resolveStationName={resolveStationName}
            resolveStationLocation={resolveStationLocation}
          />
        )}

        {activeTab === "Incidents" && (
          <Incidents
            incidents={incidents}
            onAcknowledge={handleAcknowledge}
            onClose={handleClose}
            formatDateTime={fmtDate}
          />
        )}

        {activeTab === "Reports" && (
          <Reports
            stations={stations}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            fromMonth={fromMonth}
            setFromMonth={setFromMonth}
            fromYear={fromYear}
            setFromYear={setFromYear}
            toMonth={toMonth}
            setToMonth={setToMonth}
            toYear={toYear}
            setToYear={setToYear}
            handleDownloadFiltered={handleDownloadFiltered}
            reportsLoading={reportsLoading}
            downloadingReport={downloadingReport}
            chartLocal={chartLocal}
            topStationsGlobal={topStationsGlobal}
          />
        )}

        {activeTab === "Users" && isAdmin && (
          <UserManagement
            users={users}
            filteredUsers={filteredUsers}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            handleDeleteUser={handleDeleteUser}
            loading={usersLoading}
            onBack={() => setActiveTab("Overview")}
          />
        )}
      </div>

      <EditStationModal
        open={showEditModal}
        station={editStation}
        setStation={setEditStation}
        onClose={() => {
          setShowEditModal(false);
          setEditStation(null);
        }}
        onSave={handleUpdateStation}
      />

      <AcknowledgeModal
        open={ackModal.show}
        form={ackModal.form}
        setForm={ackModal.setForm}
        onClose={ackModal.close}
        onSubmit={handleSubmitAcknowledge}
        loading={ackModal.submitting}
      />

      <CloseIncidentModal
        open={closeModal.show}
        form={closeModal.form}
        setForm={closeModal.setForm}
        onClose={closeModal.close}
        onSubmit={handleSubmitClose}
        loading={closeModal.submitting}
      />
    </div>
  );
};

export default AdminDashboard;
