import { useEffect, useState } from "react";
import { bankAPI } from "../../../services/bankService";
import Permissions from "../../../components/Permission ";

export default function BankManagement() {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "PMS",
    amount: ""
  });

  const LOW_BALANCE_THRESHOLD = 100000; // warning level

  useEffect(() => {
    fetchBank();
  }, []);

  const fetchBank = async () => {
    try {
      const res = await bankAPI.getBankBalance();
      setBank(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to fetch bank balance");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bankAPI.addBalance(form);
    setForm({ type: "PMS", amount: "" });
    fetchBank();
  };

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
          Loading Bank Details
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we Generate the bank details for you
        </p>
      </div>
    </div>
  );
  const totalBalance =
    bank.PMS +
    bank.AGO +
    bank.products +
    bank.otherIncome;

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold">
          Bank Management
        </h1>
        <p className="text-gray-300 mt-2">
          Check Current Bank Balances and Add Funds to Your Accounts
        </p>
      </div>

      {/* ================= TOTAL BALANCE ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-lg font-semibold">
          Total Bank Balance
        </h2>
        <p className="text-3xl font-bold mt-2">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* ================= ALERT ================= */}
      {totalBalance < LOW_BALANCE_THRESHOLD && (
        <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg animate-pulse">
          🚨 Bank balance is below the healthy amount.
        </div>
      )}

      {/* ================= CATEGORY CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        {[
          { label: "PMS", value: bank.PMS, color: "blue" },
          { label: "AGO", value: bank.AGO, color: "green" },
          { label: "Products", value: bank.products, color: "purple" },
          { label: "Other Income", value: bank.otherIncome, color: "yellow" },
        ].map((item) => {
          const isLow = item.value < LOW_BALANCE_THRESHOLD;

          return (
            <div
              key={item.label}
              className={`p-6 rounded-2xl shadow-lg transition ${
                isLow
                  ? "bg-red-50 border border-red-400"
                  : `bg-${item.color}-50`
              }`}
            >
              <h3 className="font-semibold text-gray-700">
                {item.label}
              </h3>

              <p className="text-2xl font-bold mt-2">
                {formatCurrency(item.value)}
              </p>

              {isLow && (
                <p className="text-red-600 text-sm mt-2 font-semibold">
                  ⚠ Low Balance
                </p>
              )}
            </div>
          );
        })}
      </div>

        <Permissions permission="AD_AC">
      {/* ================= ADD BALANCE FORM ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Add Bank Balance
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
            className="border rounded-xl p-3"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="PMS">PMS</option>
            <option value="AGO">AGO</option>
            <option value="products">Products</option>
            <option value="otherIncome">Other Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="border rounded-xl p-3"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
          <button className="bg-indigo-600 text-white rounded-xl p-3 font-semibold hover:bg-indigo-700 transition">
            Add Balance
          </button>
        </form>
      </div>
      </Permissions>

    </div>
  );
}
