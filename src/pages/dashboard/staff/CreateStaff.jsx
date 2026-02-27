import { useState } from "react";
import { staffAPI } from "../../../services/staffService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreateStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
       // Simulate loading time for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async e => {
  e.preventDefault();

  if (!form.position) {
    alert("Position is required");
    return;
  }

  if (!form.baseSalary || isNaN(form.baseSalary)) {
    alert("Base Salary must be a number");
    return;
  }

  const data = new FormData();

  Object.keys(form).forEach(key => {
    if (form[key] !== undefined && form[key] !== "") {
      data.append(key, form[key]);
    }
  });

  if (photo) data.append("photo", photo);

  await staffAPI.create(data);

  setSuccess("Staff created successfully!");
  setTimeout(() => {
    setSuccess(null);
    navigate("/dashboard/staff");
  }, 2000);
};

if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Staff Creation Form
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the staff creation form
        </p>
      </div>
    </div>
  );

 return (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-2xl
        bg-white/60 backdrop-blur-2xl
        border border-white/30
        rounded-3xl
        shadow-2xl
        p-10
        space-y-8
      "
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl
          bg-gradient-to-tr from-red-500 via-orange-400 to-blue-600
          flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-black">+</span>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Create Staff
        </h2>
        <p className="text-gray-600 mt-1">
          Add a new staff member to the system
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          className="input-field"
          placeholder="Staff ID"
          onChange={e => setForm({ ...form, staffId: e.target.value })}
        />

        <input
          className="input-field"
          placeholder="Phone Number"
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="input-field"
          placeholder="First Name"
          onChange={e => setForm({ ...form, firstName: e.target.value })}
        />

        <input
          className="input-field"
          placeholder="Last Name"
          onChange={e => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          className="input-field md:col-span-2"
          placeholder="National Identification Number (NIN)"
          onChange={e => setForm({ ...form, nin: e.target.value })}
        />

        <select
          className="input-field"
          onChange={e => setForm({ ...form, position: e.target.value })}
        >
          <option value="">Select Position</option>
          <option value="Pump Attendant">Pump Attendant</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Accountant">Accountant</option>
          <option value="Security">Security</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Driver">Driver</option>
        </select>

        <input
          type="number"
          className="input-field"
          placeholder="Base Salary"
          onChange={e => setForm({ ...form, baseSalary: e.target.value })}
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Staff Photo
        </label>

        <label className="
          flex items-center justify-center gap-3
          border-2 border-dashed border-gray-300
          rounded-2xl py-6 cursor-pointer
          hover:border-blue-500 transition
        ">
          <span className="text-gray-600 font-medium">
            Click to upload photo
          </span>
          <input
            type="file"
            className="hidden"
            onChange={e => setPhoto(e.target.files[0])}
          />
        </label>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="
          w-full py-4 rounded-2xl
          text-lg font-bold text-white
          bg-gradient-to-tr from-red-500 to-blue-600
          shadow-lg hover:shadow-xl
          hover:scale-[1.02] active:scale-95
          transition
        "
      >
        Create Staff
      </button>
    </form>
  </div>
);
}