import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditUserModal from "./EditUserModal";
import { userAPI } from "../../../services/userService";


export default function UserTable({ users, loading, refresh }) {

  const [editUserId, setEditUserId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

const handleDeleteUser = async(id)=>{

setDeleting(id);

setError(null);

setMessage(null);

try{

const res =
await userAPI.deleteUser(id);

console.log(res);

setMessage(res.msg || "User Deleted Successfully");

refresh();

}catch(error){

setError(

error?.response?.data?.msg ||

"Delete failed"

);

}
finally{

setDeleting(null);

}

};

 if (loading) {
    return <p className="text-gradient-to-r from-red-500 to-blue-600">Loading Users...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow">
        <table className="w-full table-auto border-collapse shadow rounded-xl overflow-hidden">

  <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
    <tr className="border-b text-center">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b text-center hover:bg-gray-50">
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

              <td>
                <button
onClick={()=>setEditUserId(user._id)}
className="p-2 hover:bg-blue-50 rounded"
>

<Edit className="text-blue-600"/>

</button>
                <button
                  onClick={() => setShowDeleteConfirm(user._id)}
                  className="p-2 hover:bg-red-50 rounded"
                >
                  <Trash2 className="cursor-pointer text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

  {editUserId && (
  <EditUserModal
    userId={editUserId}
    onClose={() => setEditUserId(null)}
    refresh={refresh}
  />
)}

{showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Confirm Deletion
      </h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this user? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowDeleteConfirm(null)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
disabled={deleting === showDeleteConfirm}
onClick={async ()=>{

await handleDeleteUser(showDeleteConfirm);

setShowDeleteConfirm(null);

}}
className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
>

{deleting === showDeleteConfirm
? "Deleting..."
: "Delete"}

</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
