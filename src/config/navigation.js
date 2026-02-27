import {
  LayoutDashboard,
  DollarSign,
  Users,
  Landmark,
  Fuel,
  Truck,
  Package,
  TrendingUp,
  ClipboardCheck
} from "lucide-react";

export const navItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "accountant"] },
  { name: "Users", path: "allusers", icon: Users, roles: ["admin"] },
  { name: "Daily Sales", path: "daily-sales", icon: DollarSign, roles: ["admin", "manager", "accountant"] },
  { name: "Staff", path: "staff", icon: Users, roles: ["admin", "manager"] },
  { name: "Bank", path: "bank", icon: Landmark, roles: ["admin", "accountant"] },
  { name: "Inventory", path: "inventory", icon: Fuel, roles: ["admin", "manager", "accountant"] },
  { name: "Expenses", path: "expenses", icon: Package, roles: ["admin", "accountant"] },
  { name: "P & L", path: "pmspl", icon: TrendingUp, roles: ["admin", "accountant"] },
  { name: "Audit", path: "profit-audit", icon: ClipboardCheck, roles: ["admin", "accountant"] },
  {name: "Retained Earnings", path: "retained-earnings", icon: TrendingUp, roles: ["admin", "accountant"] } 
];
