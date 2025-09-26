import React from "react";
import { motion } from "framer-motion";
import { Star, Leaf, Award } from "lucide-react";

const RestaurantHero = ({ restaurant }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8 overflow-hidden rounded-2xl"
    >
      {/* Background Image */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={restaurant.image || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
          {/* Restaurant Name and Cuisine */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {restaurant.name}
            </h1>

            {/* Cuisine Tags */}
            {restaurant.cuisine && restaurant.cuisine.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisine.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {restaurant.description && (
              <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            {/* Rating */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-white/80 text-sm">Rating</span>
            </div>

            {/* Min Order */}
            {restaurant.minOrder && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <span className="text-sm text-white/80">Min Order: </span>
                <span className="font-semibold">
                  ₦{restaurant.minOrder.toLocaleString()}
                </span>
              </div>
            )}

            {/* Awards/Special Features */}
            {restaurant.isPopular && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-orange-500/30 backdrop-blur-sm rounded-xl border border-orange-400/30">
                <Award className="h-5 w-5 text-orange-300" />
                <span className="font-semibold text-orange-100">Popular</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          {/* Eco-Friendly Badge */}
          {restaurant.isEcoFriendly && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg"
            >
              <Leaf className="h-4 w-4" />
              <span>Eco-Friendly</span>
            </motion.div>
          )}

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="px-4 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg"
          >
            Open Now
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 12}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantHero;
