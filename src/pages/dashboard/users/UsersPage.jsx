import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import UserTable from "./UserTable";
import CreateUserModal from "./CreateUserModal";
import api from "../../../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get("/auth/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-800">Users</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full
                     bg-gradient-to-r from-red-500 to-blue-600
                     text-white font-bold shadow-lg hover:scale-105 transition"
        >
          <Plus size={18} /> Create User
        </button>
      </div>

      {/* Table */}
      <UserTable users={users} loading={loading} refresh={fetchUsers} />

      {openCreate && (
        <CreateUserModal
          onClose={() => setOpenCreate(false)}
          refresh={fetchUsers}
        />
      )}
    </motion.div>
  );
}
