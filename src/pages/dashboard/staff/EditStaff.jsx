import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffAPI } from "../../../services/staffService";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    setError("");
    setMessage("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value)
    );

    if (photo) data.append("photo", photo);

    try {

    const res = await staffAPI.update(id, data);

    if (!res.data.success) {
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setError(res.data.msg || "Failed to update staff record.");
      }
      return;
    }

    setMessage(res.data.msg);
setTimeout(() => {
      navigate(`/dashboard/staff/${id}`);
}, 1000);
  } catch (err) {
    setError(err.response?.data?.msg || "An error occurred while updating staff record.");
    setSaving(false);
  }
finally {
    setSaving(false);
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
          Please wait while we fetch your staff details
        </p>
      </div>
    </div>
  );

return (
  <div className="max-w-5xl mx-auto px-4 md:px-0 py-10 space-y-10">

    {/* HEADER */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

  <div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
      Edit Staff
    </h1>
    <p className="text-gray-500 mt-2 text-sm md:text-base">
      Update staff information and employment details
    </p>
  </div>

  <div className="text-xs font-medium text-gray-500 bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
    Staff Management / Edit
  </div>

</div>


    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* PROFILE CARD */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 p-8">

        <div className="relative group">
  <img
    src={preview || "/avatar.png"}
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl transition duration-300 group-hover:scale-105 cursor-pointer"
  />

  <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
    Photo
  </div>

          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">
            Photo
          </div>
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
            JPG or PNG supported • Max size 5MB
          </p>
        </div>

      </div>


      {/* PERSONAL INFO */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 p-8">

       <div className="flex items-center justify-between border-b border-gray-100 pb-4">
  <div>
    <h2 className="text-lg font-semibold text-gray-900">
      Personal Information
    </h2>
    <p className="text-sm text-gray-400">
      Basic personal details of the staff member
    </p>
  </div>
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
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 p-8">

        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Employment Details
          </h2>
          <p className="text-sm text-gray-400">
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

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* ACTION BAR */}
      <div className="
  sticky bottom-4
  bg-white/80 backdrop-blur-xl
  border border-gray-200
  rounded-2xl
  px-6 py-4
  flex justify-between items-center
  shadow-[0_10px_30px_rgba(0,0,0,0.1)]
">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium"        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
  px-8 py-3 rounded-xl
  bg-gradient-to-tr from-red-500 via-pink-500 to-blue-600
  text-white font-semibold
  shadow-lg hover:shadow-2xl
  hover:scale-[1.03] active:scale-95
  transition duration-300
">
          {saving ? "Saving changes…" : "Save Changes"}
        </button>

      </div>

    </form>

  </div>
);
}