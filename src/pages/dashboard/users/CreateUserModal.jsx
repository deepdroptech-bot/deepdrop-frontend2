import { useState,useEffect } from "react";
import api from "../../../services/api";

export default function CreateUserModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const submit = async () => {
    setLoadingButton(true);
    setErrors({});
    setMessage("");
    try {
    const res = await api.post("/auth/users", form);
    refresh();
    onClose();
     if (res.success) {
      setMessage(res.msg);
    } else {
      setErrors(res.errors || {});
    }
  } catch (err) {
    setErrors(err.response?.data?.errors || {});
  } finally {
    setLoadingButton(false);
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
          Loading User Creation Form
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the user creation form
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-black mb-6">Create User</h2>

        {["name", "email", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : "text"}
            placeholder={field}
            className="w-full mb-4 p-3 rounded-xl border"
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <select
          className="w-full p-3 rounded-xl border mb-6"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="accountant">Accountant</option>
        </select>

        <div className="flex justify-end gap-4">
          {errors.general && (
            <p className="text-red-500 font-medium">{errors.general}</p>
          )
          }
          {message && <p className="text-green-500 font-medium">{message}</p>}

          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            disabled={loadingButton}
            className="px-6 py-3 rounded-full bg-gradient-to-r
                       from-red-500 to-blue-600 text-white font-bold"
          >
            {loadingButton ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
