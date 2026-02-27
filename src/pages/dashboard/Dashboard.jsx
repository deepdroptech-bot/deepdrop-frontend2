import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { dashboardAPI } from "../../services/dashboardService";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await dashboardAPI.getOverview();
      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          Dashboard Services
        </h1>
        <p className="text-gray-500 text-sm">
          Create, manage, and monitor all your dashboard services in one place. Get real-time insights and stay on top of your operations.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && !dashboardData && (
        <div className="text-red-500">
          Failed to load dashboard data
        </div>
      )}

      {/* Nested Routes Render Here */}
      {!loading && dashboardData && (
        <Outlet context={{ dashboardData }} />
      )}
    </DashboardLayout>
  );
}
