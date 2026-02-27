import { useEffect, useState } from "react";
import { expenseAPI } from "../../../services/expenseService";
import { useNavigate } from "react-router-dom";

export default function ExpenseManagement() {

  const [currentDoc, setCurrentDoc] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "General"
  });
  const [loading, setLoading] = useState(true);

  const fetchCurrent = async () => {
    const res = await expenseAPI.getCurrent();
    if (!res.data.msg) setCurrentDoc(res.data);
  };

  const fetchHistory = async () => {
    const res = await expenseAPI.getHistory();
    setHistory(res.data);
  };

  useEffect(() => {
    fetchCurrent();
    fetchHistory();
    // Simulate loading time for better UX    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateDocument = async () => {
    const title = prompt("Enter expense document title:");
    if (!title) return;

    await expenseAPI.createDocument({ title });
    fetchCurrent();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await expenseAPI.addExpense(form);
    setForm({ description: "", amount: "", category: "General" });
    fetchCurrent();
  };

  const handleCloseDocument = async () => {
    if (!window.confirm("Close current expense document?")) return;
    await expenseAPI.closeDocument();
    setCurrentDoc(null);
    fetchHistory();
  };

  const navigate = useNavigate();

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
          Loading Expense Management
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we Prepare the expense management data
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold">
          Expense Management
        </h1>
        <p className="text-red-100 mt-2">
          Input Expenses and View Historical Spending Patterns
        </p>
      </div>

      {/* ================= CURRENT DOCUMENT ================= */}
      {!currentDoc ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <p className="mb-4 font-semibold">
            No open expense document
          </p>
          <button
            onClick={handleCreateDocument}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
          >
            Create Expense Document
          </button>
        </div>
      ) : (
        <>
          {/* DOCUMENT INFO */}
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {currentDoc.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Started: {new Date(currentDoc.periodStart).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={handleCloseDocument}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-black transition"
              >
                Close Document
              </button>
            </div>

            <div className="mt-6">
              <p className="text-lg font-semibold">
                Total Spent:
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(currentDoc.totalAmount)}
              </p>
            </div>
          </div>

          {/* ================= ADD EXPENSE ================= */}
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="font-bold mb-4">Add Expense</h2>

            <form
              onSubmit={handleAddExpense}
              className="grid md:grid-cols-4 gap-4"
            >
              <input
                type="text"
                placeholder="Description"
                className="border rounded-xl p-3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Amount"
                className="border rounded-xl p-3"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />

              <select
                className="border rounded-xl p-3"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="PMS">PMS</option>
                <option value="AGO">AGO</option>
                <option value="products">Products</option>
                <option value="General">General</option>
              </select>

              <button className="bg-red-600 text-white rounded-xl p-3 hover:bg-red-700 transition">
                Add
              </button>
            </form>
          </div>

          {/* ================= EXPENSE LIST ================= */}
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="font-bold mb-4">
              Expense Items
            </h2>

            <div className="space-y-3">
              {currentDoc.expenses.map((exp, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-semibold">
                      {exp.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {exp.category}
                    </p>
                  </div>

                  <p className="font-bold text-red-600">
                    {formatCurrency(exp.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= HISTORY ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Expense History
        </h2>

        <div className="space-y-4">
          {history.map((doc) => (
            <div
              key={doc._id}
              onClick={() => {navigate(`/dashboard/expenses/${doc._id}`)}}
              className="bg-gray-50 p-5 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.periodStart).toLocaleDateString()}
                    {" - "}
                    {new Date(doc.periodEnd).toLocaleDateString()}
                  </p>
                </div>

                <p className="font-bold text-red-600">
                  {formatCurrency(doc.totalAmount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
