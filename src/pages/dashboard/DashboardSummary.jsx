import StatCard  from '../../components/dashboard/StatCard'
import PageLoader from '../../components/dashboard/PageLoader'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function DashboardSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then(res => setData(res.data));
  }, []);

  if (!data) return <PageLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard title="Bank Balance" value={data.bankBalance} />
      <StatCard title="Retained Earnings" value={data.retainedEarnings} />
      <StatCard title="Today's Sales" value={data.todaysSales} />
      <StatCard
        title="Current P&L"
        value={data.currentPL.amount}
        status={data.currentPL.status}
      />
    </div>
  );
}
