import { useState } from "react";
import ExecutiveDashboard from "./ExecutiveDashboard";
import OperationalDashboard from "./OperationalDashboard";

import { useOutletContext } from "react-router-dom";
import StockAlert from "../../components/dashboard/StockAlert";

export default function Overview() {
  const { dashboardData } = useOutletContext();
  const [view, setView] = useState("executive");

  if (!dashboardData) {
    return <div className="p-6">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">

      {/* View Toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setView("executive")}
          className={`px-4 py-2 rounded-xl ${
            view === "executive"
              ? "bg-blue-700 text-white"
              : "bg-white border"
          }`}
        >
          Executive View
        </button>

        <button
          onClick={() => setView("operational")}
          className={`px-4 py-2 rounded-xl ${
            view === "operational"
              ? "bg-blue-700 text-white"
              : "bg-white border"
          }`}
        >
          Operational View
        </button>
      </div>

      {/* Animated Alerts */}
      {dashboardData.alerts?.length > 0 && (
        <div className="space-y-3">
          {dashboardData.alerts.map((alert, i) => (
            <StockAlert key={i} message={alert.message} />
          ))}
        </div>
      )}

      {view === "executive" ? (
        <ExecutiveDashboard data={dashboardData} />
      ) : (
        <OperationalDashboard data={dashboardData} />
      )}
    </div>
  );
}
