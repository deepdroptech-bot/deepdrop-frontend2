import { useEffect, useState } from "react";
import { retainedEarningsAPI } from "../../../services/retainedEarningsService";

export default function RetainedEarningsPage() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRetainedEarnings = async () => {
    const res = await retainedEarningsAPI.get();
    setData(res.data);
  };

  useEffect(() => {
    fetchRetainedEarnings();
        // Simulate loading time for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val) =>
    `₦${Number(val || 0).toLocaleString()}`;

    if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Retained Earnings Data
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the retained earnings data
        </p>
      </div>
    </div>
  );


  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold">
          Retained Earnings
        </h1>
        <p className="text-indigo-200 mt-2">
          Accumulated profit retained within the business
        </p>
      </div>

      {/* ================= MAIN BALANCE CARD ================= */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">

        <p className="text-gray-500 uppercase tracking-wide">
          Current Balance
        </p>

        <h2 className={`text-5xl font-extrabold mt-4 ${
          data?.balance >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}>
          {formatCurrency(data?.balance)}
        </h2>

        <div className="mt-8 border-t pt-6 text-sm text-gray-500">

          <p>
            Last Updated:
            {" "}
            {data?.updatedAt
              ? new Date(data.updatedAt).toLocaleString()
              : "-"}
          </p>

          <p className="mt-2">
            Updated By:
            {" "}
            {data?.lastUpdatedBy?.name || "-"}
          </p>

        </div>

      </div>

      {/* ================= INFO CARD ================= */}
      <div className="bg-indigo-50 p-6 rounded-2xl">
        <h3 className="font-semibold text-indigo-700 mb-2">
          What is Retained Earnings?
        </h3>

        <p className="text-sm text-gray-700 leading-relaxed">
          Retained earnings represent the cumulative net profits
          that have been reinvested into the business rather
          than distributed. It reflects long-term financial growth
          and business sustainability.
        </p>
      </div>

    </div>
  );
}
