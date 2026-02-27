import { useEffect, useState } from "react";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function DailySalesSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // use effect for premuim UX loading state
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchSummary = async (start, end) => {
    const res = await dailySalesAPI.getSummary(start, end);
    setSummary(res.data);
  };

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Staff Creation Form
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the staff creation form
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="card-premium flex gap-4">
        <input type="date" id="start" className="input-premium" />
        <input type="date" id="end" className="input-premium" />

        <button
          className="btn-primary"
          onClick={() =>
            fetchSummary(
              document.getElementById("start").value,
              document.getElementById("end").value
            )
          }
        >
          Generate
        </button>
      </div>

      {summary && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-premium">
            <h4>Total PMS Litres</h4>
            <p className="text-2xl font-bold">
              {summary.totals.totalPMSLitres}
            </p>
          </div>

          <div className="card-premium">
            <h4>Total Sales</h4>
            <p className="text-2xl font-bold">
              ₦{summary.totals.totalSales.toLocaleString()}
            </p>
          </div>

          <div className="card-premium">
            <h4>Net Sales</h4>
            <p className="text-2xl font-bold text-green-600">
              ₦{summary.totals.netSales.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
