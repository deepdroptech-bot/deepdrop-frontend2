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

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center max-w-full overflow-x-hidden">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Users List
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we generate the list of users
        </p>
      </div>
    </div>
  );

  return (
<div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
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
  </div>
  );
}
