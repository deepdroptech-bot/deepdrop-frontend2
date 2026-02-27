import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="bg-gradient-to-tr from-red-500 to-blue-600 p-6 rounded-3xl"
      >
        <Zap className="text-white w-12 h-12" fill="currentColor" />
      </motion.div>
    </div>
  )
}
