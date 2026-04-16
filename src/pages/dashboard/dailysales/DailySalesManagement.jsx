import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";
import Permissions from "../../../components/Permission ";
import ResponseModal from "../../../components/dashboard/responseModal";

export default function DailySalesManagement() {
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [approving, setApproving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submitModal, setSubmitModal] = useState({
    isOpen: false,
    saleId: null
  });
  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    saleId: null
  });
  const [modal, setModal] = useState({
  isOpen: false,
  type: "",
  message: ""
});

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
  setSubmitting(true);
  setSubmitModal({ isOpen: false, saleId: null });

  try {
    const res = await dailySalesAPI.submit(id);

    // ✅ IMPORTANT: extract data properly
    const data = res?.data;

    console.log("Submit response:", data);

    if (data?.success) {
      setModal({
        isOpen: true,
        type: "success",
        message: data?.msg || "Submitted successfully"
      });

      fetchSales();
    } else {
      setModal({
        isOpen: true,
        type: "error",
        message: data?.msg || "Submission failed"
      });
    }

  } catch (err) {
    console.log("Submit error:", err);
    console.log("Backend error:", err.response?.data);

    setModal({
      isOpen: true,
      type: "error",
      message:
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
    });

  } finally {
    setSubmitting(false);
  }
};

  const handleApprove = async (id) => {
    setApproveModal({ isOpen: false, saleId: null });
    setApproving(true);
    try {
      const res = await dailySalesAPI.approve(id);

      const data = res?.data;
      console.log("Approve response:", data);

      if (data?.success) {
        setModal({
          isOpen: true,
          type: "success",
          message: data?.msg || "Approved successfully"
        });
        fetchSales();
      } else {
        setModal({
          isOpen: true,
          type: "error",
          message: data?.msg || "Approval failed"
        });
      }
    } catch (err) {
      console.log("Approve error:", err);
      console.log("Backend error:", err.response?.data);
      setModal({
        isOpen: true,
        type: "error",
        message:
          err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      });
    } finally {
      setApproving(false);
    }
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
      <div className="min-h-[60vh] flex items-center justify-center max-w-full overflow-x-hidden">
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
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">

      <div className="space-y-8 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
      <div className="card-premium flex flex-col md:flex-row md:items-center gap-4">
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
      <div className="flex gap-4 border-b pb-3 overflow-x-auto no-scrollbar">
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
          className="card-premium flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
          <div className="flex items-center gap-3 flex-wrap">

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
                  onClick={() => setSubmitModal({ isOpen: true, saleId: sale._id })}
                  className="btn-primary"
                >
                  Submit
                </button>
              </>
            )}

            
            {sale.approvalStatus === "submitted" && (
              <Permissions permission="AD_AC">
              <button
                onClick={() => setApproveModal({ isOpen: true, saleId: sale._id })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
          </Permissions>
            )}
          </div>
        </div>
      ))}

        {/* SUBMIT CONFIRMATION MODAL */}
        {submitModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
              <p className="mb-6">Are you sure you want to submit this daily sales record?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSubmitModal({ isOpen: false, saleId: null })}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(submitModal.saleId)}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? "Submitting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPROVE CONFIRMATION MODAL */}
        {approveModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Approval</h2>
              <p className="mb-6">Are you sure you want to approve this submitted sales record?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setApproveModal({ isOpen: false, saleId: null })}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(approveModal.saleId)}
                  disabled={approving}
                  className="btn-primary"
                >
                  {approving ? "Approving..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESPONSE MODAL */}
        <ResponseModal
  isOpen={modal.isOpen}
  type={modal.type}
  message={modal.message}
  onClose={() => setModal({ ...modal, isOpen: false })}
/>

    </div>
    </div>
  );
}
