import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function StockAlert({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-600 to-red-700 
      text-white p-4 rounded-2xl shadow-lg 
      flex items-center gap-3"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <AlertTriangle size={24} />
      </motion.div>

      <span className="font-semibold">{message}</span>
    </motion.div>
  );
}
