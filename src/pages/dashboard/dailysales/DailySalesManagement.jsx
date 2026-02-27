import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";
import Permissions from "../../../components/Permission ";

export default function DailySalesManagement() {
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const params = {
        page: 1,
        limit: 20
      };

      if (activeTab !== "all") {
        params.approvalStatus = activeTab;
      }

      if (searchDate) {
        params.salesDate = searchDate;
      }

      const res = await dailySalesAPI.getAll(params);
      setSales(res.data.salesRecords);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSales().finally(() => setLoading(false));
  }, [activeTab, searchDate]);

  const handleSubmit = async (id) => {
    if (!window.confirm("Submit this daily sales?")) return;
    await dailySalesAPI.submit(id);
    fetchSales();
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this submitted sales?")) return;
    await dailySalesAPI.approve(id);
    fetchSales();
  };

  const getStatusBadge = (status) => {
    if (status === "draft")
      return "bg-gray-100 text-gray-600";
    if (status === "submitted")
      return "bg-yellow-100 text-yellow-600";
    if (status === "approved")
      return "bg-green-100 text-green-600";
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl font-black">⏳</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            Loading Daily Sales Records
          </h2>
          <p className="text-gray-500 text-base">
            Please wait while we fetch daily sales records
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Daily Sales Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage, submit and approve daily sales records
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/dashboard/daily-sales/new")}
        >
          + Create Daily Sales
        </button>
      </div>

      {/* DATE SEARCH */}
      <div className="card-premium flex items-center gap-4">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="input-primary"
        />

        <button
          onClick={() => setSearchDate("")}
          className="btn-outline"
        >
          Reset
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-3">
        {["all", "draft", "submitted", "approved"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {sales.length === 0 && (
        <p className="text-gray-500">No records found.</p>
      )}

      {/* SALES LIST */}
      {sales.map(sale => (
        <div
          key={sale._id}
          className="card-premium flex justify-between items-center"
        >
          {/* LEFT */}
          <div
            className="cursor-pointer"
            onClick={() =>
              navigate(`/dashboard/daily-sales/${sale._id}`)
            }
          >
            <p className="font-semibold">
              {new Date(sale.salesDate).toDateString()}
            </p>

            <p className="text-sm text-gray-500">
              Net Sales: ₦{sale.netSales?.toLocaleString()}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusBadge(
                sale.approvalStatus
              )}`}
            >
              {sale.approvalStatus}
            </span>

            {sale.approvalStatus === "draft" && (
              <>
                <button
                  onClick={() =>
                    navigate(`/dashboard/daily-sales/${sale._id}/edit`)
                  }
                  className="btn-secondary"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleSubmit(sale._id)}
                  className="btn-primary"
                >
                  Submit
                </button>
              </>
            )}

            
            {sale.approvalStatus === "submitted" && (
              <Permissions permission="AD_AC">
              <button
                onClick={() => handleApprove(sale._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
          </Permissions>
            )}
          </div>
        </div>
      ))}

    </div>
  );
}
