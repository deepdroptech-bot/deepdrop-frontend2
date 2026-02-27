import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function ViewDailySales() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await dailySalesAPI.getById(id);
      setSales(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load daily sales");
      navigate("/dashboard/daily-sales");
    }
  };

  const formatCurrency = (value) =>
    `₦${Number(value || 0).toLocaleString()}`;

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Daily Sales Records For Viewing
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we fetch daily sales records for viewing
        </p>
      </div>
    </div>
  );

  if (!sales)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Sales Record Not Found
          </h2>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Daily Sales Report
          </h1>
          <p className="text-gray-500">
            {new Date(sales.salesDate).toDateString()}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            sales.approvalStatus === "approved"
              ? "bg-green-100 text-green-600"
              : sales.approvalStatus === "submitted"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {sales.approvalStatus.toUpperCase()}
        </span>
      </div>

      {/* ================= PMS & AGO ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PMS */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            PMS Sales
          </h2>

          {sales.PMS.pumps.map((pump) => (
            <div
              key={pump.pumpNumber}
              className="mb-4 p-4 bg-white rounded-xl shadow"
            >
              <p className="font-semibold text-gray-700">
                Pump {pump.pumpNumber}
              </p>
              <p>Opening: {pump.openingMeter}</p>
              <p>Closing: {pump.closingMeter}</p>
              <p className="font-medium text-blue-700">
                Litres Sold: {pump.litresSold}
              </p>
            </div>
          ))}

          <div className="border-t pt-4 space-y-1">
            <p>Price/Litre: {formatCurrency(sales.PMS.pricePerLitre)}</p>
            <p>Total Litres: {sales.PMS.totalLitres}</p>
            <p>Total Amount: {formatCurrency(sales.PMS.totalAmount)}</p>

            {/* PMS Expense Details */}
            {sales.PMS.expenses?.map((expense, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{expense.description}</span>
                <span>{formatCurrency(expense.amount)}</span>
              </div>
            ))}

            <p>Total Expenses: {formatCurrency(sales.PMS.totalExpenses)}</p>

            <p className="font-bold text-lg text-blue-900 mt-2">
              Net Sales: {formatCurrency(sales.PMS.netSales)}
            </p>
          </div>
        </div>

        {/* AGO */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            AGO Sales
          </h2>

          <div className="space-y-1">
            <p>Opening: {sales.AGO?.openingMeter}</p>
            <p>Closing: {sales.AGO?.closingMeter}</p>
            <p className="font-medium text-green-700">
              Litres Sold: {sales.AGO?.litresSold}
            </p>
            <p>Price/Litre: {formatCurrency(sales.AGO?.pricePerLitre)}</p>
            <p>Total Amount: {formatCurrency(sales.AGO?.totalAmount)}</p>

            {/* AGO Expense Details */}
            {sales.AGO?.expenses?.map((expense, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{expense.description}</span>
                <span>{formatCurrency(expense.amount)}</span>
              </div>
            ))}

             <p>Total Expenses: {formatCurrency(sales.AGO?.totalExpenses)}</p>

            <p className="font-bold text-lg text-green-900 mt-2">
              Net Sales: {formatCurrency(sales.AGO?.netSales)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          Products Sold
        </h2>

        {sales.productsSold.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b py-2 hover:bg-gray-50 transition"
          >
            <span>
              {item.itemName} ({item.quantitySold} × {formatCurrency(item.pricePerUnit)})
            </span>
            <span className="font-semibold text-purple-700">
              {formatCurrency(item.totalAmount)}
            </span>
          </div>
        ))}

        <p className="mt-4 font-bold text-lg text-purple-900">
          Total Product Sales: {formatCurrency(sales.totalProductsSales)}
        </p>
      </div>

      {/* ================= OTHER INCOME ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Other Income
        </h2>

        {sales.otherIncome.map((item, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{item.itemName}</span>
            <span className="font-medium">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}

        <p className="mt-4 font-bold text-lg text-indigo-900">
          Total Other Income: {formatCurrency(sales.totalOtherIncome)}
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Financial Summary</h2>
        <p>Total Sales: {formatCurrency(sales.totalSalesAmount)}</p>
        <p>Total Expenses: {formatCurrency(sales.totalExpenses)}</p>
        <p className="text-2xl font-extrabold mt-4">
          Net Sales: {formatCurrency(sales.netSales)}
        </p>
      </div>

      {/* ================= NOTES ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Notes
        </h2>

        {sales.notes.map((note, index) => (
          <p key={index} className="text-gray-600 mb-2">
            {note}
          </p>
        ))}
      </div>

      {/* ================= AUDIT ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Audit Information
        </h2>

        <p>Created By: {sales.createdBy?.name}</p>
        {sales.submittedBy && <p>Submitted By: {sales.submittedBy?.name}</p>}
        {sales.approvedBy && <p>Approved By: {sales.approvedBy?.name}</p>}
        {sales.updateReason && <p>Update Reason: {sales.updateReason}</p>}

        {sales.isLocked && (
          <span className="inline-block mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold">
            LOCKED
          </span>
        )}
      </div>
    </div>
  );
}
