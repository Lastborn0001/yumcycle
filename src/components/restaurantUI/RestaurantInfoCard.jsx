import React from "react";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Leaf,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const RestaurantInfoCard = ({ restaurant, orders = [] }) => {
  // Calculate some quick stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const completionRate =
    totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Cover/Header Section */}
      <div className="relative h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4">
          {restaurant?.isEcoFriendly && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-1 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium"
            >
              <Leaf className="h-3 w-3" />
              <span>Eco-Friendly</span>
            </motion.div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Restaurant Header */}
        <div className="flex items-start space-x-4 mb-6">
          {/* Restaurant Image/Avatar */}
          <div className="relative">
            {restaurant?.image ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={restaurant.image}
                alt={restaurant.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg -mt-10 relative z-10"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg -mt-10 relative z-10"
              >
                {restaurant?.name?.charAt(0) || "R"}
              </motion.div>
            )}
          </div>

          {/* Restaurant Details */}
          <div className="flex-1 pt-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {restaurant?.name || "Restaurant Name"}
            </h2>

            {/* Restaurant Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              {restaurant?.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{restaurant.location}</span>
                </div>
              )}
              {restaurant?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant?.rating && (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{restaurant.rating}/5.0 Rating</span>
                </div>
              )}
              {restaurant?.established && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Since {restaurant.established}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {totalOrders}
                </p>
                <p className="text-sm text-blue-600">Total Orders</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {completionRate.toFixed(0)}%
                </p>
                <p className="text-sm text-green-600">Success Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  ₦{totalRevenue.toFixed(0)}
                </p>
                <p className="text-sm text-purple-600">Total Revenue</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        {restaurant?.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              {restaurant.description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantInfoCard;
