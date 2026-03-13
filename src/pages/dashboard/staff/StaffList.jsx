import { useEffect, useState } from "react";
import { staffAPI } from "../../../services/staffService";
import { Link } from "react-router-dom";
import { pdfAPI } from "../../../services/pdfService";
import Permissions from "../../../components/Permission ";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    staffAPI.getAll()
      .then(res => setStaff(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handlegeneratePDF = async () => {
    try {
      setLoadingPDF(true); // Start loading

      const res = await pdfAPI.generateStaffSalaryPDF();
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Staff_Salary_List.pdf`);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Link to="/dashboard/staff/new" className="btn-primary">
          + Add Staff
        </Link>
      </div>

       <Permissions permission="AD_AC">
        <button
        
        onClick={() => handlegeneratePDF()}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        disabled={loadingPDF}
      >
        {loadingPDF ? "Generating PDF..." : "Download Staff Salary List PDF"}
      </button>

      {loadingPDF && (
        <p className="text-gray-500 text-sm mt-2">
          Please wait while your PDF is being generated.
        </p>
      )}
        </Permissions>

      <div className="grid gap-4">
        {staff.map(s => (
          <Link
            key={s._id}
            to={`/dashboard/staff/${s._id}`}
            className="bg-white p-4 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition"
          >
            <img
              src={s.photo?.url || "/avatar.png"}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">
                {s.firstName} {s.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {s.position.replace("_", " ")}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs ${
                s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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