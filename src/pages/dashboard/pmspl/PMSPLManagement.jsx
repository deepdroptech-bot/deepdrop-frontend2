import { useEffect, useState } from "react";
import { pmsPLAPI } from "../../../services/pmsPLService";

export default function PMSPLManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initialFormState = {
    periodFrom: "",
    periodTo: "",
    purchaseCost: "",
    cashAdjustments: 0
  };

  const [form, setForm] = useState(initialFormState);

  /* ================= FETCH ALL ================= */
  const fetchAll = async () => {
  try {
    const res = await pmsPLAPI.getAll();

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    setRecords(data);

  } catch (error) {
    console.error(error);
  }
};

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchAll();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= HELPERS ================= */
  const formatCurrency = (val) =>
    `₦${Number(val || 0).toLocaleString()}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const statusBadge = (status = "") => {
    const normalized = status.toLowerCase();

    const colors = {
      draft: "bg-gray-200 text-gray-700",
      submitted: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700"
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[normalized] || "bg-gray-100 text-gray-600"
        }`}
      >
        {normalized}
      </span>
    );
  };

  /* ================= CREATE ================= */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await pmsPLAPI.create(form);
      setForm(initialFormState);
      setActiveTab("list");
      await fetchAll();
    } catch (err) {
      console.error("Create error:", err);
      setError("Failed to create record.");
    }
  };

  /* ================= VIEW ================= */
  const handleView = async (id) => {
    try {
      const res = await pmsPLAPI.getById(id);
      setSelected(res.data);
      setActiveTab("view");
    } catch (err) {
      console.error("View error:", err);
      setError("Failed to load record.");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (id) => {
    try {
      await pmsPLAPI.submit(id);
      await fetchAll();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit record.");
    }
  };

  /* ================= APPROVE ================= */
  const handleApprove = async (id) => {
    try {
      await pmsPLAPI.approve(id);
      await fetchAll();
    } catch (err) {
      console.error("Approve error:", err);
      setError("Failed to approve record.");
    }
  };

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-3xl mb-4 animate-pulse">⏳</div>
          <h2 className="text-xl font-bold">
            Loading PMS Profit & Loss Records
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">PMS Profit & Loss</h1>
        <p className="text-emerald-100 mt-1">
          Period financial performance & approval workflow
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-5 py-2 rounded-xl ${
            activeTab === "list"
              ? "bg-emerald-600 text-white"
              : "bg-white shadow"
          }`}
        >
          All Records
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-5 py-2 rounded-xl ${
            activeTab === "create"
              ? "bg-emerald-600 text-white"
              : "bg-white shadow"
          }`}
        >
          Create P&L
        </button>
      </div>

      {/* ================= LIST ================= */}
      {activeTab === "list" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="py-3">Period</th>
                <th>Net Sales</th>
                <th>Purchase Cost</th>
                <th>Profit / Loss</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      {formatDate(rec.periodFrom)} -{" "}
                      {formatDate(rec.periodTo)}
                    </td>

                    <td>{formatCurrency(rec.pmsNetSales)}</td>
                    <td>{formatCurrency(rec.purchaseCost)}</td>

                    <td
                      className={`font-bold ${
                        rec.profitOrLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(rec.profitOrLoss)}
                    </td>

                    <td>{statusBadge(rec.status)}</td>

                    <td className="space-x-2">
                      <button
                        onClick={() => handleView(rec._id)}
                        className="text-indigo-600"
                      >
                        View
                      </button>

                      {rec.status === "draft" && (
                        <button
                          onClick={() => handleSubmit(rec._id)}
                          className="text-yellow-600"
                        >
                          Submit
                        </button>
                      )}

                      {rec.status === "submitted" && (
                        <button
                          onClick={() => handleApprove(rec._id)}
                          className="text-green-600"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CREATE ================= */}
      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <form
            onSubmit={handleCreate}
            className="grid md:grid-cols-2 gap-6"
          >
            <input
              type="date"
              required
              value={form.periodFrom}
              onChange={(e) =>
                setForm({ ...form, periodFrom: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="date"
              required
              value={form.periodTo}
              onChange={(e) =>
                setForm({ ...form, periodTo: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Purchase Cost"
              required
              value={form.purchaseCost}
              onChange={(e) =>
                setForm({ ...form, purchaseCost: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Cash Adjustments"
              value={form.cashAdjustments}
              onChange={(e) =>
                setForm({ ...form, cashAdjustments: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

            <button className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 col-span-2">
              Create P&L
            </button>
          </form>
        </div>
      )}

      {/* ================= VIEW ================= */}
      {activeTab === "view" && selected && (
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-3">
          <h2 className="text-xl font-bold">
            PMS Profit & Loss Details
          </h2>

          <p>
            <strong>Period:</strong>{" "}
            {formatDate(selected.periodFrom)} -{" "}
            {formatDate(selected.periodTo)}
          </p>

          <p>
            <strong>Net Sales:</strong>{" "}
            {formatCurrency(selected.pmsNetSales)}
          </p>

          <p>
            <strong>Purchase Cost:</strong>{" "}
            {formatCurrency(selected.purchaseCost)}
          </p>

          <p>
            <strong>Cash Adjustments:</strong>{" "}
            {formatCurrency(selected.cashAdjustments)}
          </p>

          <p
            className={`text-lg font-bold ${
              selected.profitOrLoss >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Profit / Loss:{" "}
            {formatCurrency(selected.profitOrLoss)}
          </p>

          <p>
            <strong>Status:</strong> {selected.status}
          </p>

          <button
            onClick={() => setActiveTab("list")}
            className="bg-gray-800 text-white px-6 py-2 rounded-xl"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}