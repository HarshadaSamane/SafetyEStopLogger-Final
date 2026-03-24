import { Calendar } from "lucide-react";
import ReportsFilters from "../dashboard/Reports/ReportsFilters";
import IncidentsByDayChart from "../dashboard/Reports/IncidentsByDayChart";
import IncidentsByStationChart from "../dashboard/Reports/IncidentsByStationChart";
import StatusPieChart from "../dashboard/Reports/StatusPieChart";
import TopStationsChart from "../dashboard/Reports/TopStationsChart";

const Reports = ({
  stations,
  selectedStation,
  setSelectedStation,

  fromDate,
  setFromDate,
  toDate,
  setToDate,

  fromMonth,
  setFromMonth,
  fromYear,
  setFromYear,
  toMonth,
  setToMonth,
  toYear,
  setToYear,

  handleDownloadFiltered,
  reportsLoading,
  downloadingReport,

  chartLocal,
  topStationsGlobal,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
        Reports & Analytics
      </h3>

      {/* Filters */}
      <ReportsFilters
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
        onDownload={handleDownloadFiltered}
        loading={reportsLoading}
        downloading={downloadingReport}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentsByDayChart data={chartLocal.incidentsByDay} />
        <IncidentsByStationChart data={chartLocal.incidentsByStation} />
        <StatusPieChart data={chartLocal.statusSplit} />
        <TopStationsChart data={topStationsGlobal} />
      </div>
    </div>
  );
};

export default Reports;
