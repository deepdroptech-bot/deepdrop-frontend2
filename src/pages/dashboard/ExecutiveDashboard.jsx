import KpiCard from "../../components/dashboard/KpiCard";
import ChartCard from "../../components/dashboard/ChartCard";
import { useOutletContext } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ExecutiveDashboard() {
  const { dashboardData: data } = useOutletContext();

  const formatMoney = (value) =>
    (value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  const monthlyNetSales =
  data?.charts?.monthlyNetSales?.map(item => ({
    date: item._id,
    amount: item.total 
  })) || [];

const growthTrend =
  data?.charts?.monthlyNetSales?.map(item => ({
    date: item._id,
    value: item.total 
  })) || [];

  const insights = data?.insights || [];

  return (
    <>
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">

        <KpiCard
          title="Net Sales"
          value={data?.totals?.totalNetSales || 0}
        />

        <KpiCard
          title="Total Profit"
          value={data?.totals?.totalProfit || 0}
        />

        <KpiCard
          title="Profit Margin (%)"
          value={data?.totals?.profitMargin || 0}
        />

        <KpiCard
          title="Growth Rate (%)"
          value={data?.performance?.growthRate || 0}
          highlight
        />
      </div>

      {/* INSIGHTS SECTION (NEW 🔥) */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🧠 Business Insights
        </h3>

        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="text-sm text-gray-700">
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* Net Sales Trend */}
        <ChartCard title="Net Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyNetSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatMoney(value)} />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Growth Trend */}
        <ChartCard title="Performance Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatMoney(value)} />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#1d4ed8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* BEST PRODUCT */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800">
          🏆 Best Performing Product
        </h3>

        {data?.bestPerformingProduct ? (
          <p className="mt-2 text-gray-700">
            {data.bestPerformingProduct._id} — ₦
            {data.bestPerformingProduct.totalRevenue.toLocaleString()}
          </p>
        ) : (
          <p className="text-gray-500 mt-2">No data available</p>
        )}
      </div>

      {/* BANK SUMMARY */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">

        <KpiCard
          title="Bank Balance"
          value={data?.bank?.totalBalance || 0}
        />

        <KpiCard
          title="Total Expenses"
          value={data?.totals?.totalExpenses || 0}
        />

        <KpiCard
          title="Low Stock Items"
          value={data?.inventory?.lowProductsCount || 0}
        />

      </div>
    </>
  );
}