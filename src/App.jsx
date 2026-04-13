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
import StaffHistory from "./pages/dashboard/staff/StaffHistory";

// Daily Sales Management pages
import DailySalesManagement from "./pages/dashboard/dailysales/DailySalesManagement";
import EditDailySales from "./pages/dashboard/dailysales/EditDailySales";
import CCreateDailySales from "./pages/dashboard/dailysales/CreateDailySales";
import ViewDailySales from "./pages/dashboard/dailysales/ViewDailySales";

// Inventory Management pages
import InventoryManagement from "./pages/dashboard/inventory/InventoryManagement";
import FuelHistory from "./pages/dashboard/inventory/fuelHistory";
import ProductHistory from "./pages/dashboard/inventory/productHistory";

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

// Unauthorized page
import Unauthorized from "./pages/dashboard/Unauthorized";


//Debugging page
import ErrorBoundary from "./pages/ErrorBoundary";

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
        {/* <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login/agbor-rd" element={<Login />} />
        <Route path="/login/ekiosa" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
  <Route path="/test" element={<Test />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" />} />

 {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>

    <Route index element={<Overview />} />

    {/* Admin only */}
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="allusers" element={<UsersPage />} />
      <Route path="createuser" element={<CreateUserModal />} />
      <Route path="edituser/:id" element={<EditUserModal />} />
    </Route>

    {/* Admin  and Accountant */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "accountant"]} />}>
      <Route path="expenses" element={<ExpenseManagement />} />
    <Route path="expenses/:id" element={<ViewExpense />} />
    <Route path="pmspl" element={<PMSPLManagement />} />
    <Route path="retained-earnings" element={<RetainedEarningsPage />} />
    <Route path="bank" element={<BankManagement />} />
      </Route>

    {/* All authenticated users */}
    <Route path="profile" element={<ProfilePage />} />
    <Route path="daily-sales/new" element={<CCreateDailySales />} />
    <Route path="daily-sales/:id" element={<ViewDailySales />} />
    <Route path="daily-sales/:id/edit" element={<EditDailySales />} />
    <Route path="inventory/fuel-history" element={<FuelHistory />} />
    <Route path="inventory" element={<InventoryManagement />} />
    <Route path="inventory/product-history" element={<ProductHistory />} />
    <Route path="daily-sales" element={<DailySalesManagement />} />
    <Route path="profit-audit" element={<ProfitAuditManagement />} />
    <Route path="staff" element={<StaffList />} />
    <Route path="staff/new" element={<CreateStaff />} />
    <Route path="staff/:id/edit" element={<EditStaff />} />
    <Route path="staff/adjustments/:id" element={<StaffAdjustments />} />
    <Route path="staff/:id" element={<StaffProfile />} />
    <Route path="staff/:id/history" element={<StaffHistory/>}
/>
    

  </Route>
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
