import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import  { useState, useEffect } from "react";
import logo from "../assets/logo.png"

export default function Loader() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-red-500 via-blue-500 to-white"
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-tr from-red-500 to-blue-600 p-8 rounded-3xl shadow-2xl"
            >
              <img src={logo} alt="Logo" className="w-20 h-20" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
  );
}
<Zap className="text-white w-20 h-20" fill="currentColor" />