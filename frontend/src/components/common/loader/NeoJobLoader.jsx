import React from "react";
import { motion as Motion } from "motion/react";
import { BriefcaseBusiness } from "lucide-react";

const NeoJobLoader = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#E8F0EC] to-[#F8FBFA]">
      
      {/* Soft background glow blobs */}
      <Motion.div
        className="absolute w-96 h-96 bg-[#20365c]/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="absolute w-72 h-72 bg-[#688ac2]/10 rounded-full blur-2xl right-10 bottom-10"
        animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Briefcase Logo */}
      <Motion.div
        className="relative w-28 h-28 flex items-center justify-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1, 0.8], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <BriefcaseBusiness className="w-12 h-12 text-[#20365c]" />
        <Motion.span
          className="absolute inset-0 border-4 border-t-transparent border-[#20365c]/40 rounded-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </Motion.div>

      {/* Text */}
      <Motion.h2
        className="mt-8 text-3xl font-semibold text-[#1d3b32]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Finding the Right Opportunities...
      </Motion.h2>
      <Motion.p
        className="text-gray-500 mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Please wait while we load your dream jobs
      </Motion.p>

      {/* Shimmer progress line */}
      <div className="w-72 h-2 bg-gray-200 mt-8 rounded-full overflow-hidden">
        <Motion.div
          className="h-full bg-gradient-to-r from-[#20365c] via-[#688ac2] to-[#20365c]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <Motion.div
          key={i}
          className="absolute w-3 h-3 bg-[#20365c]/30 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default NeoJobLoader;

