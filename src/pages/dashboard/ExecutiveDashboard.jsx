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


  const monthlyRevenue =
    data?.charts?.monthlyRevenue?.map(item => ({
      date: item._id,
      amount: item.revenue
    })) || [];

  const profitTrend =
    data?.charts?.monthlyRevenue?.map(item => ({
      date: item._id,
      profit: item.revenue // you can change to real profit trend later
    })) || [];

  return (
    <>
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={data.totals?.totalRevenue || 0}
        />

        <KpiCard
          title="Total Profit"
          value={data.totals?.totalProfit || 0}
        />

        <KpiCard
          title="Profit Margin (%)"
          value={data.totals?.profitMargin || 0}
        />

        <KpiCard
          title="Growth Rate (%)"
          value={data.performance?.growthRate || 0}
          highlight
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* Monthly Revenue Trend */}
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Profit Trend */}
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#1d4ed8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}
