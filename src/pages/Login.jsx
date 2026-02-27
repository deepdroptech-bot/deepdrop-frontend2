import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowLeft, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BouncyButton } from "../components/BouncyButton";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";

export default function Login({ branchName }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const { login, user } = useAuth();

  // Simulate page loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

 const handleLogin = async e => {
    e.preventDefault()
    try {
    await login(
      email,
      password
    )
  }
    catch (err) {
        alert("Login failed: " + (err.response?.data?.msg || err.message))
      }
  }

useEffect(() => {
  if (user) {
    if (user.role === "admin") navigate("/dashboard");
    if (user.role === "manager") navigate("/dashboard");
    if (user.role === "accountant") navigate("/dashboard");
  }
}, [user, navigate]);


  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-red-600 via-blue-600 to-white p-4">

      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-red-500 via-blue-500 to-white animate-gradient-xy opacity-30" />
        <div className="absolute top-16 left-16 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* AnimatePresence for loading */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-tr from-red-500 to-blue-600 p-6 rounded-3xl shadow-2xl"
            >
              <img src={logo} alt="Deepdrop Logo" className="w-24 h-24 mb-4" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 border border-white/30"
          >
            {/* Back button */}
            <Link
              to="/get-started"
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>

            {/* Logo */}
            <div className="text-center mb-8 mt-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-tr from-red-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-red-200 rotate-3"
              >
                <User className="text-white w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl font-black text-gray-800 mb-2">
                Sign in to {branchName || "your branch"}
              </h1>
              <p className="text-gray-500 font-medium">
                Enter your credentials to continue
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">

                {/* Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-medium"
                    placeholder="hello@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-200 mr-2"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <BouncyButton
                type="submit"
                className="w-full py-4 text-lg shadow-xl shadow-red-200 mt-4"
              >
                Sign In
              </BouncyButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
