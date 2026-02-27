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
  const lowProducts = dashboardData?.lowProducts || [];

  const pieData = [
    { name: "PMS", value: inventory.pmsQty || 0 },
    { name: "AGO", value: inventory.agoQty || 0 }
  ];

  const COLORS = ["#1d4ed8", "#dc2626"];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Inventory Pie */}
      <ChartCard title="Inventory Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Low Products */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <h3 className="text-blue-700 font-semibold mb-4">
          Low Stock Products
        </h3>

        {lowProducts.length === 0 ? (
          <p className="text-gray-500">
            All products sufficiently stocked.
          </p>
        ) : (
          <ul className="space-y-2">
            {lowProducts.map((product, i) => (
              <motion.li
                key={i}
                animate={{ x: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-red-600 font-medium"
              >
                {product.itemName} — {product.quantity} left
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
