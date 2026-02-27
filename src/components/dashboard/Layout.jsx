import { motion } from "framer-motion"
import { Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Layout({ title, children }) {
//   const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-6 flex justify-between">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">
          {title}
        </h1>
        <div className="font-semibold text-gray-600">
          {/* {user?.name} ({user?.role}) */}
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8"
      >
        {children}
      </motion.main>
    </div>
  )
}
