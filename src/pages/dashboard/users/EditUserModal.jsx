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

  useEffect(() => {
    api.get(`/auth/users/${userId}`).then((res) => {
      setForm({
        ...res.data,
        password: "",
        confirmPassword: "",
      });
    });
  }, [userId]);

  const submit = async () => {
    await api.put(`/auth/users/${userId}`, form);
    refresh();
    onClose();
  };

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

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="px-6 py-3 rounded-full font-bold text-white
                       bg-gradient-to-r from-red-500 to-blue-600"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
