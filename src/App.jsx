import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login"
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardSummary from "./pages/dashboard/DashboardSummary";


// Dashboard sub-pages
import Overview from "./pages/dashboard/DashboardOverview";
import Dashboard from "./pages/dashboard/Dashboard";

//User management pages
import ProfilePage from "./pages/dashboard/ProfilePage";
import CreateUserModal from "./pages/dashboard/users/CreateUserModal";
import UsersPage from "./pages/dashboard/users/UsersPage";
import EditUserModal from "./pages/dashboard/users/EditUserModal";

// Staff Management pages
import StaffProfile from "./pages/dashboard/staff/StaffProfile";
import StaffList from "./pages/dashboard/staff/StaffList";
import CreateStaff from "./pages/dashboard/staff/CreateStaff";
import EditStaff from "./pages/dashboard/staff/EditStaff";
import StaffAdjustments from "./pages/dashboard/staff/StaffAdjustments";

// Daily Sales Management pages
import DailySalesSummary from "./pages/dashboard/dailysales/DailySalesSummary";
import DailySalesManagement from "./pages/dashboard/dailysales/DailySalesManagement";
import EditDailySales from "./pages/dashboard/dailysales/EditDailySales";
import CCreateDailySales from "./pages/dashboard/dailysales/CreateDailySales";
import ViewDailySales from "./pages/dashboard/dailysales/ViewDailySales";

// Inventory Management pages
import InventoryManagement from "./pages/dashboard/inventory/InventoryManagement";

// Bank Management pages
import BankManagement from "./pages/dashboard/bank/BankManagement";

// Retained Earnings Management page
import RetainedEarningsPage from "./pages/dashboard/retainedearnings/RetainedEarningsManagemen";

// PMSPL Management page
import PMSPLManagement from "./pages/dashboard/pmspl/PMSPLManagement";

// expense management page
import ExpenseManagement from "./pages/dashboard/expense/ExpenseManagement";
import ViewExpense from "./pages/dashboard/expense/ViewExpense";

// profit and audit management page
import ProfitAuditManagement from "./pages/dashboard/profit&audit/Profit&AuditManagement";

// import { useState, useEffect } from "react";
// import Loader from "./components/Loader";

import Test from "./pages/Test";

function App() {
  
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // simulate app boot / API check
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) return <Loader />;


  return (
    <BrowserRouter>
   {/* Public routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login/agbor-rd" element={<Login />} />
        <Route path="/login/ekiosa" element={<Login />} />
        <Route path="/login" element={<Login />} />

 {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>

    <Route index element={<Overview />} />

    {/* User management routes */}
    <Route path="myprofile" element={<ProfilePage />} />
    <Route path="allusers" element={<UsersPage />} />
    <Route path="createuser" element={<CreateUserModal />} />
    <Route path="edituser" element={<EditUserModal />} />

    {/* Staff management routes */}
    <Route path="staff" element={<StaffList />} />
    <Route path="staff/new" element={<CreateStaff />} />
    <Route path="staff/:id/edit" element={<EditStaff />} />
    <Route path="staff/adjustments/:id" element={<StaffAdjustments />} />
    <Route path="staff/:id" element={<StaffProfile />} />

    {/* Daily sales management routes */}
    <Route path="daily-sales" element={<DailySalesManagement />} />
    <Route path="daily-sales/summary" element={<DailySalesSummary />} />
    <Route path="daily-sales/:id/edit" element={<EditDailySales />} />
    <Route path="daily-sales/new" element={<CCreateDailySales />} />
    <Route path="daily-sales/:id" element={<ViewDailySales />} />

    {/* Inventory management routes */}
    <Route path="inventory" element={<InventoryManagement />} />

    {/* Bank management routes */}
    <Route path="bank" element={<BankManagement />} />

    {/* Retained earnings management route */}
    <Route path="retained-earnings" element={<RetainedEarningsPage />} />

    {/* PMSPL management route */}
    <Route path="pmspl" element={<PMSPLManagement />} />

    {/* Expense management route */}
    <Route path="expenses" element={<ExpenseManagement />} />
    <Route path="expenses/:id" element={<ViewExpense />} />

    {/* Profit and audit management route */}
    <Route path="profit-audit" element={<ProfitAuditManagement />} />

  </Route>
</Route>




<Route path="/test" element={<Test />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
