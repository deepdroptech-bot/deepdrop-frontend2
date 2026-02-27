import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffAPI } from "../../../services/staffService";
import Permissions from "../../../components/Permission ";

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bonus, setBonus] = useState({ amount: "", reason: "" });
  const [deduction, setDeduction] = useState({ amount: "", reason: "" });

  useEffect(() => {
    staffAPI.getById(id)
      .then(res => setStaff(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Staff Profile
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we fetch the staff profile
        </p>
      </div>
    </div>
  );

  if (!staff) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-2xl font-black">⚠️</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Staff Not Found
        </h2>
        <p className="text-gray-500 text-base">
          The requested staff member does not exist.
        </p>
      </div>
    </div>
  );

  const handleBonus = async () => {
    await staffAPI.addBonus(id, bonus);
    const updated = await staffAPI.getById(id);
    setStaff(updated.data);
    setBonus({ amount: "", reason: "" });
  };

  const handleDeduction = async () => {
    await staffAPI.addDeduction(id, deduction);
    const updated = await staffAPI.getById(id);
    setStaff(updated.data);
    setDeduction({ amount: "", reason: "" });
  };

  const handlePaySalary = async () => {
    await staffAPI.paySalary(id);
    const updated = await staffAPI.getById(id);
    setStaff(updated.data);
  };

  const toggleStatus = async () => {
    staff.isActive
      ? await staffAPI.deactivate(id)
      : await staffAPI.activate(id);

    const updated = await staffAPI.getById(id);
    setStaff(updated.data);
  };

  const deleteStaff = async () => {
    if (!confirm("Are you sure you want to delete this staff?")) return;
    await staffAPI.delete(id);
    navigate("/dashboard/staff");
  };

  return (
  <div className="space-y-10">

    {/* HEADER CARD */}
    <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">

      <img
        src={staff.photo?.url || "/avatar.png"}
        className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg"
        alt="staff"
      />

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {staff.firstName} {staff.lastName}
        </h1>

        <p className="text-gray-500 mt-1 text-lg capitalize">
          {staff.position.replace("_", " ")}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Staff ID: {staff.staffId}
        </p>
      </div>

      <span
        className={`px-6 py-2 rounded-full text-sm font-semibold shadow ${
          staff.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {staff.employmentStatus}
      </span>
    </div>


    {/* INFO + SALARY GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* STAFF INFO */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Staff Information
        </h3>

        <ul className="space-y-4 text-gray-600">
          <li><span className="font-semibold text-gray-800">Phone:</span> {staff.phone}</li>
          <li><span className="font-semibold text-gray-800">NIN:</span> {staff.nin}</li>
          <li>
            <span className="font-semibold text-gray-800">Hire Date:</span>{" "}
            {new Date(staff.hireDate).toDateString()}
          </li>
        </ul>
      </div>


      {/* SALARY CARD */}
      <div className="relative bg-gradient-to-tr from-red-500 via-orange-400 to-blue-600 rounded-3xl p-[2px] shadow-2xl">
        <div className="bg-white rounded-3xl p-8 h-full">

          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Salary Overview
          </h3>

          <ul className="space-y-4 text-gray-700">
            <li className="flex justify-between">
              <span>Base Salary</span>
              <span className="font-semibold">
                ₦{staff.baseSalary.toLocaleString()}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Total Bonuses</span>
              <span className="text-green-600 font-semibold">
                ₦{staff.bonuses.reduce((s,b)=>s+b.amount,0).toLocaleString()}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Total Deductions</span>
              <span className="text-red-600 font-semibold">
                ₦{staff.deductions.reduce((s,d)=>s+d.amount,0).toLocaleString()}
              </span>
            </li>

            <li className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Net Salary</span>
              <span>
                ₦{staff.netSalary.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>


    {/* BONUS & DEDUCTION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* BONUS */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          Add Bonus
        </h3>

        <input
          placeholder="Amount"
          type="number"
          value={bonus.amount}
          onChange={e => setBonus({ ...bonus, amount: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <input
          placeholder="Reason"
          value={bonus.reason}
          onChange={e => setBonus({ ...bonus, reason: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <button
          className="w-full py-3 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 transition shadow"
          onClick={handleBonus}
        >
          Add Bonus
        </button>
      </div>


      {/* DEDUCTION */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          Apply Deduction
        </h3>

        <input
          placeholder="Amount"
          type="number"
          value={deduction.amount}
          onChange={e => setDeduction({ ...deduction, amount: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none"
        />

        <input
          placeholder="Reason"
          value={deduction.reason}
          onChange={e => setDeduction({ ...deduction, reason: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none"
        />

        <button
          className="w-full py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition shadow"
          onClick={handleDeduction}
        >
          Apply Deduction
        </button>
      </div>
    </div>


    {/* ACTION BUTTONS */}
    <div className="flex flex-wrap gap-4 pt-4">

    <Permissions permission="AD_AC">
      <button
        className="px-6 py-3 rounded-2xl font-semibold bg-blue-500 text-white shadow hover:shadow-lg transition"
        onClick={handlePaySalary}
      >
        Pay Salary
      </button>
      </Permissions>

      <button
        className="px-6 py-3 rounded-2xl font-semibold bg-white border border-gray-300 shadow hover:shadow-lg transition"
        onClick={() => navigate(`/dashboard/staff/${id}/edit`)}
      >
        Edit Staff
      </button>

      <button
        className={`px-6 py-3 rounded-2xl font-semibold text-white shadow transition ${
          staff.isActive
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={toggleStatus}
      >
        {staff.isActive ? "Deactivate" : "Activate"}
      </button>

      <Permissions permission="AD_AC">
      <button
        className="px-6 py-3 rounded-2xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow transition"
        onClick={deleteStaff}
      >
        Delete Staff
      </button>
      </Permissions>
    </div>

  </div>
);}