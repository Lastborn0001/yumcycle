const mongoose = require("mongoose");
const Restaurant = require("./src/models/Restaurant");
const { connectToDatabase } = require("./src/libs/db/mongo");

async function seedRestaurants() {
  try {
    await connectToDatabase();
    const restaurants = [
      {
        name: "Kaduna Kitchen",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
        cuisine: ["Nigerian", "African", "Local"],
        rating: 4.7,
        minOrder: 1200,
        deliveryTime: "20-35 min",
        deliveryFee: 400,
        distance: "1.8 km",
        isEcoFriendly: true,
        location: "12 Ahmadu Bello Way, Kaduna",
      },
      {
        name: "Suya Spot",
        image:
          "https://images.unsplash.com/photo-1544027995-7a2d06e7bcf1?q=80&w=2070",
        cuisine: ["Nigerian", "Barbecue", "Street Food"],
        rating: 4.3,
        minOrder: 800,
        deliveryTime: "15-30 min",
        deliveryFee: 300,
        distance: "1.2 km",
        isEcoFriendly: false,
        location: "25 Yakubu Gowon Way, Kaduna",
      },
      {
        name: "Green Leaf Cafe",
        image:
          "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cuisine: ["Continental", "Vegetarian", "Salads"],
        rating: 4.5,
        minOrder: 1500,
        deliveryTime: "25-40 min",
        deliveryFee: 500,
        distance: "2.3 km",
        isEcoFriendly: true,
        location: "8 Constitution Road, Kaduna",
      },
      {
        name: "Spice Haven",
        image:
          "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=2064",
        cuisine: ["Indian", "Curry", "Tandoori"],
        rating: 4.4,
        minOrder: 2000,
        deliveryTime: "30-45 min",
        deliveryFee: 600,
        distance: "3.5 km",
        isEcoFriendly: false,
        location: "15 Alkali Road, Kaduna",
      },
      {
        name: "Mama's Jollof",
        image:
          "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cuisine: ["Nigerian", "West African"],
        rating: 4.8,
        minOrder: 1000,
        deliveryTime: "20-35 min",
        deliveryFee: 350,
        distance: "1.5 km",
        isEcoFriendly: true,
        location: "7 Hospital Road, Kaduna",
      },
      {
        name: "Pizza Palace",
        image:
          "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2076",
        cuisine: ["Italian", "Pizza", "Fast Food"],
        rating: 4.2,
        minOrder: 1800,
        deliveryTime: "25-40 min",
        deliveryFee: 550,
        distance: "2.8 km",
        isEcoFriendly: false,
        location: "22 Junction Road, Kaduna",
      },
      {
        name: "Golden Shawarma",
        image:
          "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cuisine: ["Middle Eastern", "Fast Food"],
        rating: 4.6,
        minOrder: 900,
        deliveryTime: "15-25 min",
        deliveryFee: 300,
        distance: "1.0 km",
        isEcoFriendly: true,
        location: "10 Kachia Road, Kaduna",
      },
      {
        name: "Chop & Chill",
        image:
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070",
        cuisine: ["Continental", "Grill", "Burgers"],
        rating: 4.3,
        minOrder: 1600,
        deliveryTime: "30-45 min",
        deliveryFee: 500,
        distance: "3.2 km",
        isEcoFriendly: false,
        location: "5 Independence Way, Kaduna",
      },
      {
        name: "Amala Joint",
        image:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cuisine: ["Nigerian", "Yoruba", "Local"],
        rating: 4.5,
        minOrder: 1100,
        deliveryTime: "20-35 min",
        deliveryFee: 400,
        distance: "2.0 km",
        isEcoFriendly: true,
        location: "18 Barnawa Road, Kaduna",
      },
      {
        name: "Sizzling Soups",
        image:
          "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=1974",
        cuisine: ["Nigerian", "Soups", "African"],
        rating: 4.7,
        minOrder: 1300,
        deliveryTime: "25-40 min",
        deliveryFee: 450,
        distance: "2.7 km",
        isEcoFriendly: true,
        location: "30 Sabon Tasha, Kaduna",
      },
      {
        name: "Burger Bonanza",
        image:
          "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cuisine: ["American", "Fast Food", "Burgers"],
        rating: 4.4,
        minOrder: 1400,
        deliveryTime: "20-30 min",
        deliveryFee: 400,
        distance: "1.9 km",
        isEcoFriendly: false,
        location: "14 Ungwan Rimi, Kaduna",
      },
      {
        name: "Taste of Hausa",
        image:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974",
        cuisine: ["Nigerian", "Hausa", "Local"],
        rating: 4.6,
        minOrder: 1000,
        deliveryTime: "20-35 min",
        deliveryFee: 350,
        distance: "1.7 km",
        isEcoFriendly: true,
        location: "9 Zaria Road, Kaduna",
      },
    ];

    await Restaurant.deleteMany({}); // Clear existing data
    await Restaurant.insertMany(restaurants);
    console.log("Restaurants seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
}

seedRestaurants();
