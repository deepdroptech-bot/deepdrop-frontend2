import { useState } from "react";
import api from "../../../services/api";

export default function CreateUserModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const submit = async () => {
    await api.post("/auth/users", form);
    refresh();
    onClose();
  };

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
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="px-6 py-3 rounded-full bg-gradient-to-r
                       from-red-500 to-blue-600 text-white font-bold"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
