import { motion as Motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from 'react';

const AnimatedToast = ({ message, type = "success", duration = 5000, onClose }) => {
  const [show, setShow] = useState(true);

  const typeStyles = {
    success: "bg-gradient-to-r from-green-500 to-green-600 border-green-400",
    error: "bg-gradient-to-r from-red-500 to-red-600 border-red-400",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400"
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleExitComplete = () => {
    if (!show) onClose?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <Motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`p-4 rounded-xl border-2 text-white shadow-2xl max-w-sm ${typeStyles[type]} relative overflow-hidden`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex-shrink-0 text-lg"
              >
                {icons[type]}
              </Motion.span>
              <Motion.p
                className="text-sm font-medium"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </Motion.p>
            </div>
            <Motion.button
              onClick={() => setShow(false)}
              className="text-white hover:text-gray-200 text-lg font-bold flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </Motion.button>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <Motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
            />
          )}
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedToast;
