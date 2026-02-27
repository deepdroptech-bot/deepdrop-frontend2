import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, User, Building } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

import ekiosa from "../assets/ekiosa.jpeg";
import agbor from "../assets/agbor-rd.jpeg";

export default function GetStartedPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Two branches for login
  const branches = [
    {
      name: "Agbor RD Branch",
            image:
              agbor,
      link: "/login/agbor-rd",
      icon: <Building className="w-6 h-6 text-white" />,
      color: "bg-red-500",
      borderColor: "border-red-500",
    },
    {
      name: "Ekiosa Branch",
      image:
        ekiosa,
      link: "/login/ekiosa",
      icon: <User className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      borderColor: "border-blue-500",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-red-600 via-blue-600 to-white p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-red-500 via-blue-500 to-white animate-gradient-xy opacity-30" />
        <div className="absolute top-16 left-16 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

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
            key="content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative z-10 w-full max-w-7xl px-6 py-16"
          >
            <h1 className="text-2xl md:text-4xl font-black text-center text-white mb-12 drop-shadow-lg">
              Choose Your Designated Branch
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {branches.map((branch, index) => (
                <Link to={branch.link} key={index} className="block w-full h-[500px]">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50, damping: 20, delay: index * 0.2 }}
                    whileHover={{ scale: 1.03, rotateY: index % 2 === 0 ? 5 : -5 }}
                    className={`relative rounded-[2.5rem] border-4 ${branch.borderColor} overflow-hidden shadow-2xl h-full cursor-pointer`}
                  >
                    {/* Image Background */}
                    <div className="absolute inset-0">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Overlay Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                      <div
                        className={`w-12 h-12 rounded-2xl ${branch.color} flex items-center justify-center mb-6`}
                      >
                        {branch.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                        {branch.name}
                      </h3>
                      <p className="text-lg text-white/90 font-medium drop-shadow-md">
                        Click to log in to {branch.name} dashboard
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
