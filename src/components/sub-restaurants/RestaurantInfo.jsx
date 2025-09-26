import React from "react";
import { motion } from "framer-motion";
import { Clock, Truck, MapPin, Phone, Globe, CreditCard } from "lucide-react";

const RestaurantInfo = ({ restaurant }) => {
  const infoCards = [
    {
      icon: Clock,
      title: "Delivery Time",
      value: restaurant.deliveryTime || "30-45 min",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Truck,
      title: "Delivery Fee",
      value: `₦${restaurant.deliveryFee?.toLocaleString() || '500'}`,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Distance",
      value: restaurant.distance || "2.5 km",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {infoCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`${card.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-3 bg-white rounded-xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Detailed Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Restaurant Details</h3>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Contact Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {restaurant.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{restaurant.phone}</p>
                  </div>
                </div>
              )}
              
              {restaurant.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-gray-600">Website</p>
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}

              {restaurant.location && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{restaurant.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          {restaurant.operatingHours && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Operating Hours</span>
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {Object.entries(restaurant.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium text-gray-900">{day}:</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment Methods</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {['Card Payment', 'Bank Transfer', 'Cash on Delivery'].map((method, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                >
                  ✓ {method}
                </span>
              ))}
            </div>
          </div>

          {/* Special Features */}
          {(restaurant.isEcoFriendly || restaurant.hasDelivery || restaurant.hasPickup) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Special Features</h4>
              <div className="flex flex-wrap gap-3">
                {restaurant.isEcoFriendly && (
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                    🌱 Eco-Friendly
                  </span>
                )}
                {restaurant.hasDelivery && (
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                    🚚 Delivery Available
                  </span>
                )}
                {restaurant.hasPickup && (
                  <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                    🏪 Pickup Available
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RestaurantInfo;