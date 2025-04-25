import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"
      ></motion.div>
    </div>
  );
};

export default Loading;
