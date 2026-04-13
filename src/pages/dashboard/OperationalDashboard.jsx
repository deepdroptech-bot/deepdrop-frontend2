import ChartCard from "../../components/dashboard/ChartCard";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import Permissions from "../../components/Permission ";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

export default function OperationalDashboard() {
  const { dashboardData } = useOutletContext();

  const inventory = dashboardData?.inventory || {};
  const bank = dashboardData?.bank || {};

  /* =========================
     FORMAT HELPERS
  ========================= */
  const formatMoney = (value) =>
    (value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  const formatDecimal = (value) =>
    (value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  /* =========================
     PIE DATA (rounded)
  ========================= */
  const pieData = [
  { name: "PMS", value: inventory.pmsQty || 0 },
  { name: "AGO", value: inventory.agoQty || 0 }
];

  const COLORS = ["#a33716", "#26a9dc"];

  /* =========================
     BAR DATA (inventory breakdown)
  ========================= */

  const productBarData = inventory.productChart || [];

  const productSalesBarData = inventory.productSalesChart || [];

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-full overflow-x-hidden">

      {/* =========================
          INVENTORY PIE
      ========================= */}
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
            <Tooltip formatter={(value) => formatDecimal(value)} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      

      {/* =========================
          Inventory
      ========================= */}

       <ChartCard title="Product Sales Levels">

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={productSalesBarData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#3b82f6" />
    </BarChart>
  </ResponsiveContainer>

</ChartCard>


      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

        <ChartCard title="Product Inventory Levels">

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={productBarData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#bef63b" />
    </BarChart>
  </ResponsiveContainer>

</ChartCard>

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

      {/* =========================
          BANK OVERVIEW + HISTORY
      ========================= */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-between gap-6">

        {/* BANK SUMMARY */}
        <Permissions permission="AD_AC">
        <div className="w-1/2">
          <h3 className="font-semibold text-blue-700 mb-3">
            🏦 Bank Overview
          </h3>

          <p>
            Total Balance: ₦{formatMoney(bank.totalBalance)}
          </p>

          <div className="mt-2 text-sm text-gray-600">
            PMS: ₦{formatMoney(bank.breakdown?.PMS)} <br />
            AGO: ₦{formatMoney(bank.breakdown?.AGO)} <br />
            Products: ₦{formatMoney(bank.breakdown?.products)} <br />
            Other Income: ₦{formatMoney(bank.breakdown?.otherIncome)}
          </div>
        </div>
        </Permissions>

        {/* BANK HISTORY */}
        <div className="w-1/2 border-l pl-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            📜 Recent Transactions
          </h3>

        <Permissions permission="AD_AC">
          <h4 className="text-lg border-b font-semibold mb-3">💰 Bank Activity</h4>

          {bank.recentTransactions?.length > 0 ? (
            <div className="space-y-2 text-sm">
              {bank.recentTransactions.map((tx, i) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span>
                    {new Date(tx.addedAt).toLocaleDateString()}
                  </span>
                  <span className={`font-medium ${
tx.type === "PMS"
? "text-blue-400"
: tx.type === "AGO"
? "text-green-400"
: tx.type === "products"
? "text-purple-400"
: "text-pink-400"
}`} >
                    {tx.type}
                  </span>
                  <span className="font-medium">
                    ₦{formatMoney(tx.amount || 0)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No recent transactions
            </p>
          )}
          </Permissions>

             <h4 className="text-lg border-b font-semibold mb-3">⛽ Fuel Activity</h4>

    {data?.inventory?.recentFuelHistory?.map((item, i) => (
      <div key={i} className="text-sm text-gray-700 mb-2">
        {item.type} • {item.quantity}L • Well {item.wellNumber || "-"}
      </div>
    ))}

      <h4 className="text-lg border-b font-semibold mb-3">📦 Product Activity</h4>
         {data?.inventory?.recentProductHistory?.map((item, i) => (
      <div key={i} className="text-sm text-gray-700 mb-2">
        {item.name} • {item.quantity} pcs
      </div>
    ))}
        </div>

      </div>

    </div>
  );
}