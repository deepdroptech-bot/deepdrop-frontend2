import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/Layout";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
