import { useEffect, useState, } from "react"
import api from "../../services/api"
import { BouncyButton } from "../../components/BouncyButton"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Input from "../../components/Input"



export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then(res => {
      setForm(f => ({
        ...f,
        name: res.data.name,
        email: res.data.email
      }))
    })

    setTimeout(() => setPageLoading(false), 1000);
  }, [])

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogout = () => {
  logout(
    () => {
      setShowLogoutModal(false);
      navigate("/get-started");
    }
  );
};

const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  if (form.password && form.password !== form.confirmPassword) {
  setMessage({ type: "error", text: "Passwords do not match" });
  setLoading(false);
  return;
}

  try {
    await api.put("/auth/me", form);
    setMessage({ type: "success", text: "Profile updated successfully" });
    setForm(f => ({ ...f, password: "", confirmPassword: "" }));
  } catch (err) {
    setMessage({
      type: "error",
      text: err.response?.data?.msg || "Update failed"
    });
  } finally {
    setLoading(false);
  }
};

  if (pageLoading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Profile Information
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we provide your profile info
        </p>
      </div>
    </div>
  );
      

  return (
    <div className="flex justify-center">
      <motion.div
        className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Account Settings
          </h2>
          <p className="text-gray-500 mt-1">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="New Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          </div>

          {message && (
            <p
              className={`mt-4 text-sm font-semibold ${
                message.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="mt-8 flex justify-between items-center">
            <BouncyButton isLoading={loading} size="lg">
              Save Changes
            </BouncyButton>

            {/* Styled Logout Button */}
            <button
                          type="button"
                          onClick={() => setShowLogoutModal(true)}
                          className="px-6 py-3 rounded-xl font-semibold 
                                    bg-red-600 text-white 
                                    hover:bg-red-700 
                                    transition-all duration-200 
                                    shadow-md hover:shadow-lg 
                                    active:scale-95"
                        >
                          Logout
                        </button>
          </div>
        </form>
      </motion.div>
      {showLogoutModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowLogoutModal(false)}
    />

    {/* Modal */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl z-10"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        Confirm Logout
      </h3>

      <p className="text-gray-600 mb-6">
        Are you sure you want to logout of your account?
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Yes, Logout
        </button>
      </div>
    </motion.div>
  </div>
)}
    </div>
);
}

// 

// 
