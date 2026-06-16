import {useEffect, useState} from "react";
import { expenseAPI } from "../../../services/expenseService";
import { useNavigate, useParams } from "react-router-dom";
import { pdfAPI } from "../../../services/pdfService";

export default function ViewExpense() {
  const [expenseDoc, setExpenseDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    fetchCurrent();
}, []);

    const fetchCurrent = async () => {
    try {
        setLoading(true);

        const res = await expenseAPI.getDocumentExpenses(id);

        if (res?.data) {
            setExpenseDoc(res.data);
        }

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

const handlegeneratePDF = async () => {
    try {
      setLoadingPDF(true); // Start loading

      const res = await pdfAPI.generateExpensePDF(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Expense_Report_${expenseDoc?.title || "Unnamed"}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoadingPDF(false); // Stop loading
    }
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
                        Loading Expense Details
                    </h2>
                    <p className="text-gray-500 text-base">
                        Please wait while we fetch the expense details for you
                    </p>
                </div>
            </div>
        );

        if (!expenseDoc) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-gray-500">No expense document found</p>
        </div>
    );
}

return (
  <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">

    {/* HEADER SECTION */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      {/* Title + Date */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
          {expenseDoc?.title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Created At:{" "}
          <span className="font-medium text-gray-700">
            {expenseDoc?.createdAt &&
              new Date(expenseDoc.createdAt).toLocaleString()}
          </span>
        </p>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => handlegeneratePDF()}
          disabled={loadingPDF}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingPDF ? "Generating PDF..." : "Download PDF"}
        </button>

      </div>
    </div>

    {/* TABLE CARD */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

      <table className="w-full text-left">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm uppercase tracking-wide">
          <tr>
            <th className="p-4">Description</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Category</th>
          </tr>
        </thead>

        <tbody>
          {expenseDoc?.expenses?.map((exp, index) => (
            <tr
              key={exp._id}
              className={`border-t hover:bg-blue-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-4 font-medium text-gray-700">
                {exp.description}
              </td>

              <td className="p-4 font-semibold text-green-600">
                {formatCurrency(exp.amount)}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  {exp.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* FOOTER ACTION */}
    <div className="mt-6 flex justify-end">
      <button
        onClick={() => navigate("/dashboard/expenses")}
        className="px-5 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition shadow"
      >
        Back to Expense Management
      </button>
    </div>
  </div>
);
}