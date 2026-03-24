import { AlertCircle } from "lucide-react";
import IncidentsList from "../dashboard/IncidentsList";

const Incidents = ({ incidents, onAcknowledge, onClose, formatDateTime }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
        Active Incidents
      </h3>

      <IncidentsList
        incidents={incidents}
        onAcknowledge={onAcknowledge}
        onClose={onClose}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};

export default Incidents;
