import { motion } from 'framer-motion'
// import Money from './Money'

export default function StatCard({ title, value, status }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
    >
      <p className="text-gray-500 font-medium">{title}</p>

      <h2 className="text-3xl font-black mt-2">
        <Money amount={value} />
      </h2>

      {status && (
        <span className={`text-sm mt-2 inline-block ${
          status === 'approved'
            ? 'text-green-600'
            : 'text-orange-500'
        }`}>
          {status.toUpperCase()}
        </span>
      )}
    </motion.div>
  )
}
