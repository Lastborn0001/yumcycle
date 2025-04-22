import { connectToDatabase } from "@/libs/db/mongo";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import admin from "@/libs/firebaseAdmin";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Authenticated user:", decoded);
    return decoded;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    const { reference, email, amount } = await req.json();

    if (reference) {
      // Verify payment with Paystack
      console.log("Verifying Paystack transaction:", reference);
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Paystack verification result:", result);

      if (
        !response.ok ||
        result.status !== true ||
        result.data.status !== "success"
      ) {
        throw new Error(result.message || "Payment verification failed");
      }

      // Create order
      const cart = await Cart.findOne({ userUid: decoded.uid });
      if (!cart || !cart.items.length) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const subtotal = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const deliveryFee = 30;
      const serviceFee = 40;
      const tax = 300;
      const tip = 400;
      const donation = 2;
      const total = subtotal + deliveryFee + serviceFee + tax + tip + donation;

      const order = await Order.create({
        userUid: decoded.uid,
        items: cart.items,
        subtotal,
        deliveryFee,
        serviceFee,
        tax,
        tip,
        donation,
        total,
        paymentIntentId: reference,
        status: "completed",
      });

      console.log("Order created:", order);

      // Create notifications for each restaurant
      const restaurantIds = [
        ...new Set(cart.items.map((item) => item.restaurantId)),
      ];
      for (const restaurantId of restaurantIds) {
        const restaurantItems = cart.items.filter(
          (item) => item.restaurantId === restaurantId
        );
        const orderIdString = order._id.toString(); // Convert ObjectId to string
        console.log("Creating notification with orderId:", orderIdString);
        await Notification.create({
          restaurantId,
          orderId: orderIdString,
          message: `New order received from customer (Order #${orderIdString.slice(
            -6
          )})`,
          orderDetails: {
            userUid: decoded.uid,
            items: restaurantItems.map((item) => ({
              _id: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              restaurantName: item.restaurantName,
            })),
            subtotal: restaurantItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            total,
            createdAt: order.createdAt,
          },
        });
        console.log(`Notification created for restaurant ${restaurantId}`);
      }

      // Clear cart
      await Cart.updateOne({ userUid: decoded.uid }, { items: [] });

      return NextResponse.json({ success: true, orderId: order._id });
    }

    // Initialize payment
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

    console.log("Initializing Paystack transaction:", { amount, email });
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
    console.log("Paystack initialization result:", result);

    if (!response.ok || result.status !== true) {
      throw new Error(result.message || "Failed to initialize payment");
    }

    return NextResponse.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error("POST /api/payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
