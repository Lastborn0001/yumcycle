import React from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, Clock, TrendingDown } from "lucide-react";

const FoodWasteHero = () => {
  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300C851' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 px-6"
        >
          {/* Icon Animation */}
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          {/* Headlines */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Food Surplus{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Marketplace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover discounted surplus food from local restaurants. Help reduce
            food waste while enjoying great meals at incredible prices. Every
            purchase makes a difference!
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-700">Up to 70% Off</span>
            </div>

            <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-gray-700">
                Help Environment
              </span>
            </div>

            <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-700">Limited Time</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mx-6"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Our Environmental Impact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                2,500+
              </div>
              <div className="text-gray-600">Meals Saved</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">60%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                1,200kg
              </div>
              <div className="text-gray-600">CO₂ Saved</div>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-green-200/30 rounded-full"
              style={{
                top: `${15 + i * 10}%`,
                left: `${5 + i * 11}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodWasteHero;
