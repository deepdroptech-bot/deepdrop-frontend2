import { useState } from "react";
import { staffAPI } from "../../../services/staffService";
import { useAuth } from "../../../context/AuthContext";

export default function StaffAdjustments({ staff }) {
  const { user } = useAuth();
  const canEdit = ["admin", "manager"].includes(user.role);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("bonus");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = { amount: Number(amount), reason };

    if (type === "bonus") {
      await staffAPI.addBonus(staff._id, payload);
    } else {
      await staffAPI.addDeduction(staff._id, payload);
    }

    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Base Salary</p>
          <p className="text-xl font-bold">₦{staff.baseSalary}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Net Salary</p>
          <p className="text-xl font-bold text-green-600">
            ₦{staff.netSalary}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">{staff.employmentStatus}</p>
        </div>
      </div>

      {/* ADD BONUS / DEDUCTION */}
      {canEdit && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="font-semibold">Apply Adjustment</h3>

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="bonus">Bonus</option>
            <option value="deduction">Deduction</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />

          <input
            placeholder="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
          />

          <button className="btn-primary">
            {loading ? "Processing..." : "Apply"}
          </button>
        </form>
      )}

      {/* HISTORY */}
      <div className="grid md:grid-cols-2 gap-6">
        <HistoryTable title="Bonuses" data={staff.bonuses} />
        <HistoryTable title="Deductions" data={staff.deductions} />
      </div>
    </div>
  );
}

function HistoryTable({ title, data }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{title}</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No records</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Amount</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="py-2">₦{item.amount}</td>
                <td>{item.reason}</td>
                <td>
                  {new Date(item.appliedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
