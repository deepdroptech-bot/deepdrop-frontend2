import {useEffect, useState} from "react";
import { expenseAPI } from "../../../services/expenseService";
import { useNavigate } from "react-router-dom";

export default function ViewExpense() {
  const [expenseDoc, setExpenseDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const fetchCurrent = async () => {
        const res = await expenseAPI.getDocumentExpenses();
        if (!res.data.msg) setExpenseDoc(res.data);
    };

    useEffect(() => {
        fetchCurrent();
        // Simulate loading time for better UX
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
                        Loading Expense Details
                    </h2>
                    <p className="text-gray-500 text-base">
                        Please wait while we fetch the expense details for you
                    </p>
                </div>
            </div>
        );

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
                {expenseDoc.title}
            </h2>
            <p className="text-gray-500 mb-6">
                Created At: {new Date(expenseDoc.createdAt).toLocaleString()}
            </p>
            <table className="w-full text-left border-collapse">
                <thead>
                <tr>
                    <th className="border-b p-3">Description</th>
                    <th className="border-b p-3">Amount</th>
                    <th className="border-b p-3">Category</th>
                </tr>
                </thead>
                <tbody>
                {expenseDoc.expenses.map((exp) => (
                    <tr key={exp._id}>
                        <td className="border-b p-3">{exp.description}</td>
                        <td className="border-b p-3">{formatCurrency(exp.amount)}</td>
                        <td className="border-b p-3">{exp.category}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => navigate("/dashboard/expenses")}
                    className="btn-secondary"
                >
                    Back to Expense Management
                </button>
            </div>
        </div>
    );
}
