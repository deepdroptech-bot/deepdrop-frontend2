import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffAPI } from "../../../services/staffService";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nin: "",
    position: "",
    baseSalary: "",
    employmentStatus: ""
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    staffAPI.getById(id).then(res => {
      const s = res.data;
      setForm({
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        nin: s.nin,
        position: s.position,
        baseSalary: s.baseSalary,
        employmentStatus: s.employmentStatus
      });
      setPreview(s.photo?.url || "");
      setLoading(false);
    });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value)
    );

    if (photo) data.append("photo", photo);

    await staffAPI.update(id, data);

    setSaving(false);
    navigate(`/dashboard/staff/${id}`);
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
          Please wait while we fetch your staff details
        </p>
      </div>
    </div>
  );

return (
  <div className="max-w-4xl mx-auto px-4 md:px-0 py-8 space-y-10">

    {/* PAGE HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Edit Staff
        </h1>
        <p className="text-gray-500 mt-1">
          Update staff information and employment details
        </p>
      </div>

      <div className="text-sm text-gray-400">
        Staff Management / Edit
      </div>
    </div>


    <form onSubmit={handleSubmit} className="space-y-8">

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-8">

        <div className="relative">
          <img
            src={preview || "/avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm"
          />
        </div>

        <div className="flex-1 space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Profile Photo
          </label>

          <input
            type="file"
            accept="image/*"
            className="file-input"
            onChange={e => {
              setPhoto(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />

          <p className="text-xs text-gray-400">
            JPG, PNG formats supported. Maximum file size 5MB.
          </p>
        </div>
      </div>


      {/* PERSONAL INFO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Basic personal details of the staff member
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="input-primary"
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="input-primary"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input-primary"
            required
          />

          <input
            name="nin"
            placeholder="National Identification Number (NIN)"
            value={form.nin}
            onChange={handleChange}
            className="input-primary"
            required
          />

        </div>
      </div>


      {/* EMPLOYMENT DETAILS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Employment Details
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Role assignment, salary structure and employment status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="input-primary"
            required
          >
            <option value="">Select Position</option>
            <option value="Pump Attendant">Pump Attendant</option>
            <option value="Cashier">Cashier</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Security">Security</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Driver">Driver</option>
          </select>

          <input
            name="baseSalary"
            type="number"
            placeholder="Base Salary"
            value={form.baseSalary}
            onChange={handleChange}
            className="input-primary"
            required
          />

          <select
            name="employmentStatus"
            value={form.employmentStatus}
            onChange={handleChange}
            className="input-primary"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
          </select>

        </div>
      </div>


      {/* ACTION BAR */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            px-8 py-3
            rounded-xl
            bg-gradient-to-tr from-red-500 to-blue-600
            text-white font-semibold
            shadow-md hover:shadow-lg
            hover:scale-[1.02] active:scale-95
            transition
            min-w-[180px]
          "
        >
          {saving ? "Saving changes…" : "Save Changes"}
        </button>

      </div>

    </form>
  </div>
);
}