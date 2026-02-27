import { useEffect, useState } from "react";
import { staffAPI } from "../services/staffService";
import { Link } from "react-router-dom";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffAPI.getAll()
      .then(res => setStaff(res.data))
      .finally(() => setLoading(false));
  }, []);

    if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Staff Details
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we fetch staff details
        </p>
      </div>
    </div>
  );

  return (
<div className="space-y-8">
  {/* HEADER CARD */}
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* LEFT: Title + Breadcrumb */}
    <div className="text-center sm:text-left">
      <p className="text-sm text-gray-400 mb-1">
        Dashboard &gt; Staff
      </p>
      <h1 className="text-3xl font-extrabold text-gray-800">
        Staff Management
      </h1>
      <p className="text-gray-500 mt-2 max-w-md">
        View and manage all registered staff members
      </p>
    </div>

    {/* RIGHT: CTA */}
    <Link
      to="/dashboard/staff/add"
      className="btn-primary flex items-center gap-2 px-6 py-3 shadow-md hover:shadow-lg transition-all"
    >
      <span className="text-lg leading-none">+</span>
      Add Staff
    </Link>
  </div>




    {/* STAFF LIST */}
    <div className="space-y-3">
      {staff.map(s => (
        <Link
          key={s._id}
          to={`/dashboard/staff/${s._id}`}
          className="card flex items-center gap-4 hover:shadow-lg hover:-translate-y-[1px] transition-all"
        >
          {/* AVATAR */}
          <img
            src={s.photo?.url || "/avatar.png"}
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />

          {/* INFO */}
          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {s.firstName} {s.lastName}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {s.position.replace("_", " ")}
            </p>
          </div>

          {/* STATUS */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              s.employmentStatus === "active"
                ? "bg-green-100 text-green-700"
                : s.employmentStatus === "inactive"
                ? "bg-gray-100 text-gray-600"
                : s.employmentStatus === "suspended"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {s.employmentStatus}
          </span>
        </Link>
      ))}
    </div>
  </div>
);
}