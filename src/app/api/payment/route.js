// app/api/payment/route.js
import { connectToDatabase } from "@/libs/db/mongo";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import admin from "@/libs/firebaseAdmin";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper function to verify Paystack transaction with retries
async function verifyPaystackTransaction(reference, retries = 3) {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  };

  for (let i = 0; i < retries; i++) {
    try {
      //   console.log(`Verifying Paystack transaction (attempt ${i + 1})`);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== true || result.data.status !== "success") {
        throw new Error(result.message || "Payment verification failed");
      }

      return result;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);

      if (i === retries - 1 || error.name !== "TimeoutError") {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Authentication helper
async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    // Validate environment configuration
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error("Payment processing configuration error");
    }

    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    const { reference, email, amount, phoneNumber, address } = await req.json();

    if (reference) {
      // Verify payment with retry mechanism
      const result = await verifyPaystackTransaction(reference);
      //   console.log("Paystack verification successful:", result);

      // Validate required fields
      if (!phoneNumber || !address) {
        return NextResponse.json(
          { error: "Phone number and address are required" },
          { status: 400 }
        );
      }

      // Get cart and validate
      const cart = await Cart.findOne({ userUid: decoded.uid });
      if (!cart || !cart.items.length) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      // Validate single restaurant
      const restaurantIds = [
        ...new Set(cart.items.map((item) => item.restaurantId)),
      ];
      if (restaurantIds.length > 1) {
        return NextResponse.json(
          { error: "All items must be from the same restaurant" },
          { status: 400 }
        );
      }

      const restaurantId = restaurantIds[0];
      if (!restaurantId) {
        return NextResponse.json(
          { error: "Restaurant ID missing in cart items" },
          { status: 400 }
        );
      }

      // Calculate order totals
      const subtotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const fees = {
        deliveryFee: 30,
        serviceFee: 40,
        tax: 300,
        tip: 400,
        donation: 2,
      };
      const total = subtotal + Object.values(fees).reduce((a, b) => a + b, 0);

      // Create order
      const order = await Order.create({
        userUid: decoded.uid,
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        items: cart.items.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          image: item.image,
          category: item.category,
          description: item.description,
        })),
        subtotal,
        ...fees,
        total,
        phoneNumber,
        address,
        paymentIntentId: reference,
        status: "pending",
      });

      //   console.log("Order created:", order);

      // Create notifications
      const orderIdString = order._id.toString();
      await Notification.create({
        restaurantId,
        orderId: orderIdString,
        message: `New order received (Order #${orderIdString.slice(-6)})`,
        orderDetails: {
          userUid: decoded.uid,
          items: cart.items.map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            restaurantName: item.restaurantName,
          })),
          subtotal,
          total,
          phoneNumber,
          address,
          createdAt: order.createdAt,
        },
      });

      // Clear cart
      await Cart.updateOne({ userUid: decoded.uid }, { items: [] });

      return NextResponse.json({
        success: true,
        orderId: order._id,
        message: "Order created successfully",
      });
    }

    // Payment initialization
    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userUid: decoded.uid });
    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          email: email || decoded.email,
          currency: "NGN",
          channels: ["card", "bank_transfer", "ussd", "mobile_money"],
        }),
      }
    );

    const result = await response.json();
    if (!response.ok || result.status !== true) {
      throw new Error(result.message || "Failed to initialize payment");
    }

    return NextResponse.json({
      success: true,
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error("Payment processing error:", {
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Payment processing failed",
        code: error.code || "INTERNAL_ERROR",
      },
      {
        status: error.message.includes("Unauthorized")
          ? 401
          : error.message.includes("validation")
          ? 400
          : 500,
      }
    );
  }
}
