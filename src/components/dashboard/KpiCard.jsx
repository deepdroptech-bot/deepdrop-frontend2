import { motion } from "framer-motion";

export default function KpiCard({ title, value, highlight }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`bg-white p-6 rounded-2xl shadow-lg border 
      ${highlight ? "border-red-500" : "border-blue-100"}`}
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-red-600">
        ₦{value?.toLocaleString()}
      </h3>
    </motion.div>
  );
}
