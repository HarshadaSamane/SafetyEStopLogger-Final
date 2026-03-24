import {
  MapPin,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Pencil,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import StatCard from "../dashboard/StatCard";
import RecentIncidentsTable from "../dashboard/RecentIncidentsTable";
import CreateStationForm from "../dashboard/CreateStationForm";

const PIE_COLORS = ["#F59E0B", "#10B981", "#EF4444", "#3B82F6"];

const Overview = ({
  stats,
  openIncidentCount,
  chartData,
  recentIncidents,
  stations,
  role,
  isOperator,
  showCreateStation,
  setShowCreateStation,
  newStation,
  setNewStation,
  handleCreateStation,
  handleToggleStation,
  setEditStation,
  setShowEditModal,
  stationLoading,
  formatDateTime,
  resolveStationName,
  resolveStationLocation,
}) => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Stations"
          value={stats?.totalStations ?? 0}
          icon={<MapPin className="w-12 h-12 text-blue-500 opacity-20" />}
          color="border-blue-500"
        />
        <StatCard
          title="Open Incidents"
          value={stats?.openIncidents ?? openIncidentCount ?? 0}
          icon={<AlertCircle className="w-12 h-12 text-red-500 opacity-20" />}
          color="border-red-500"
        />
        <StatCard
          title="Acknowledged Incidents"
          value={stats?.acknowledgedIncidents ?? 0}
          icon={
            <CheckCircle className="w-12 h-12 text-yellow-500 opacity-20" />
          }
          color="border-yellow-500"
        />
        <StatCard
          title="Total Incidents"
          value={stats?.totalIncidents ?? 0}
          icon={<Activity className="w-12 h-12 text-purple-500 opacity-20" />}
          color="border-purple-500"
        />
      </div>

      {/* Charts */}
      {!isOperator && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              Incidents per Station (Last 30 days)
            </h3>

            {chartData?.incidentsByStation?.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData.incidentsByStation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stationName" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No chart data available.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <PieChart className="w-6 h-6 text-emerald-600 mr-2" />
              Status Split
            </h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { status: "Open", value: stats?.openIncidents ?? 0 },
                      {
                        status: "Acknowledged",
                        value: stats?.acknowledgedIncidents ?? 0,
                      },
                      { status: "Closed", value: stats?.closedIncidents ?? 0 },
                    ]}
                    dataKey="value"
                    nameKey="status"
                    label
                  >
                    {[0, 1, 2].map((i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Incidents */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
          Recent Incidents
        </h3>

        <RecentIncidentsTable
          recentIncidents={recentIncidents}
          formatDateTime={formatDateTime}
          resolveStationName={resolveStationName}
          resolveStationLocation={resolveStationLocation}
        />
      </div>

      {/* Stations */}
      {role === "admin" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              Stations
            </h3>

            <button
              onClick={() => setShowCreateStation(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Create Station
            </button>
          </div>

          {showCreateStation && (
            <CreateStationForm
              newStation={newStation}
              setNewStation={setNewStation}
              onCancel={() => setShowCreateStation(false)}
              onSubmit={handleCreateStation}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stations.map((s) => (
              <div key={s.id} className="border p-4 rounded-lg">
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-sm text-gray-500">{s.location}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditStation(s);
                      setShowEditModal(true);
                    }}
                  >
                    <Pencil />
                  </button>

                  <button
                    onClick={() => handleToggleStation(s.id)}
                    disabled={stationLoading[s.id]}
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Overview;
