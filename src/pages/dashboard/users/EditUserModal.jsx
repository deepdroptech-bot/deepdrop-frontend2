import { useEffect, useState } from "react";
import api from "../../../services/api";
import { motion } from "framer-motion";

export default function EditUserModal({ userId, onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    isActive: true,
    password: "",
    confirmPassword: "",
  });
    const [error, setError] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/auth/users/${userId}`).then((res) => {
      setForm({
        ...res.data,
        password: "",
        confirmPassword: "",
      });
    });
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  const submit = async () => {
    e.preventDefault();
    setLoadingButton(true);
    setError("");
    setMessage("");

    try {
   const res = await api.put(`/auth/users/${userId}`, form);
      if (res.success) {
        setMessage(res.msg);
      }
        else {
        setError(res.msg || "Failed to update user");
      }
    refresh();
    onClose();
  }
    catch (err) {
      setError(err.response?.data?.msg || "An error occurred");
    }
      finally {
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
          Loading User Edit Form
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the user edit form
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-black mb-6">Edit User</h2>

        <input
          className="w-full p-3 rounded-xl border mb-4"
          value={form.name}
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-3 rounded-xl border mb-4"
          value={form.email}
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="w-full p-3 rounded-xl border mb-4"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="accountant">Accountant</option>
        </select>

        {/* Activate / Deactivate */}
        <label className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          <span className="font-medium">
            {form.isActive ? "Active" : "Inactive"}
          </span>
        </label>

        {/* Optional Password Reset */}
        <input
          type="password"
          className="w-full p-3 rounded-xl border mb-4"
          placeholder="New Password (optional)"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 rounded-xl border mb-6"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
          {error && (
            <p className="text-red-500 font-medium mb-4">{error}</p>
          )}
          {message && (
            <p className="text-green-500 font-medium mb-4">{message}</p>
          )}

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="px-6 py-3 rounded-full font-bold text-white
                       bg-gradient-to-r from-red-500 to-blue-600"
            disabled={loadingButton}
          >
            {loadingButton ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
