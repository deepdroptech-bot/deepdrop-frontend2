import  { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { BouncyButton } from "../components/BouncyButton";

import logo from "../assets/logo.png";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-blue-600 to-white/30 backdrop-blur-[2px]" />
      </div>

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
              className="bg-gradient-to-tr from-red-500 to-blue-600 p-6 rounded-3xl shadow-2xl"
                          >
                            <img src={logo} alt="Deepdrop Logo" className="w-24 h-24 mb-4" />
            </motion.div>
          </motion.div> 
         ) : (
          <>
            {/* Navigation */}
            {/* <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-black text-white drop-shadow-md flex items-center gap-2"
              >
                <div className="bg-white text-red-500 p-2 rounded-xl">
                  <Zap size={24} fill="currentColor" />
                </div>
                VIBE
              </motion.div>
            </nav> */}

            {/* Hero Content */}
            <main className="flex-1 flex items-center justify-center px-4 text-center relative z-10">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
              >
                <motion.div variants={itemVariants} className="mb-6 inline-block">
                  <span className="bg-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full text-lg font-bold border border-white/50 shadow-lg flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-200" fill="currentColor" />
                    More Quality For Less Price
                  </span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-6xl md:text-8xl font-black text-black mb-8 drop-shadow-lg leading-tight"
                >
                  DEEPDROP
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-400">
                    ENERGY LIMITED
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Wecome to the Deepdrop Experience, Where Energy Meets Tech.
                </motion.p>

                <motion.div variants={itemVariants} className="flex justify-center items-center">
                  <Link to="/get-started">
                    <BouncyButton size="lg" rightIcon={<ArrowRight size={20} />}>
                      Get Started Now
                    </BouncyButton>
                  </Link>
                </motion.div>
              </motion.div>
            </main>
          </>
        )} 
      </AnimatePresence>
    </div>
  );
}

