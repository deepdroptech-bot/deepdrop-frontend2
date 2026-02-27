import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditUserModal from "./EditUserModal";


export default function UserTable({ users, loading, refresh }) {
  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  const [editUserId, setEditUserId] = useState(null);


  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-4 font-medium">{user.name}</td>
              <td>{user.email}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold
                    ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : user.role === "manager"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {user.role}
                </span>
              </td>

              <td>
                <span
                  className={`font-bold ${
                    user.isActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="p-4 flex justify-end gap-4">
                <Edit className="cursor-pointer text-blue-600" />
                <Trash2 className="cursor-pointer text-red-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Edit
  onClick={() => setEditUserId(users._id)}
  className="cursor-pointer text-blue-600"
/>
  {editUserId && (
  <EditUserModal
    userId={editUserId}
    onClose={() => setEditUserId(null)}
    refresh={refresh}
  />
)}
</div> 
  );
}
