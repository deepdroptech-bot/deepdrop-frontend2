import ChartCard from "../../components/dashboard/ChartCard";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

export default function OperationalDashboard() {
  const { dashboardData } = useOutletContext();

  const inventory = dashboardData?.inventory || {};
  const bank = dashboardData?.bank || {};

  const pieData = [
    { name: "PMS", value: inventory.pmsQty || 0 },
    { name: "AGO", value: inventory.agoQty || 0 }
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* INVENTORY PIE */}
      <ChartCard title="Fuel Inventory Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* LOW STOCK */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

        <h3 className="text-green-700 font-semibold mb-4">
          📦 Low Stock Alert ({inventory.lowProductsCount || 0})
        </h3>

        {inventory.lowProductsCount === 0 ? (
          <p className="text-gray-500">
            All products are sufficiently stocked.
          </p>
        ) : (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-red-600 font-medium"
          >
            ⚠️ Some products are running low. Check inventory module.
          </motion.p>
        )}
      </div>

      {/* BANK STATUS */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">

        <h3 className="font-semibold text-blue-700 mb-3">
          🏦 Bank Overview
        </h3>

        <p>Total Balance: ₦{bank.totalBalance || 0}</p>

        <div className="mt-2 text-sm text-gray-600">
          PMS: ₦{bank.breakdown?.PMS || 0} <br />
          AGO: ₦{bank.breakdown?.AGO || 0} <br />
          Products: ₦{bank.breakdown?.products || 0} <br />
          Other Income: ₦{bank.breakdown?.otherIncome || 0}
        </div>
      </div>

    </div>
  );
}