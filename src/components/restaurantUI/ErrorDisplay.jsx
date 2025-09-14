import React from "react";
import { motion } from "framer-motion";

const ErrorDisplay = () => {
  return (
    <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-white min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold text-red-500 mb-4">{error}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all"
        >
          Try Again
        </motion.button>
        {error.includes("forbidden") && (
          <p className="mt-4 text-sm text-gray-500">
            Your restaurant is not yet approved. Please contact support or wait
            for admin approval.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorDisplay;
