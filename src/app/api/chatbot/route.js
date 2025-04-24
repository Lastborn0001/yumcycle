// src/app/api/chatbot/route.js
import { connectToDatabase } from "@/libs/db/mongo";
import Order from "@/models/Order";
import { SessionsClient } from "@google-cloud/dialogflow";
import { NextResponse } from "next/server";

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionClient = new SessionsClient({
  credentials: {
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function POST(req) {
  try {
    await connectToDatabase();
    const { query, sessionId } = await req.json();

    if (!query || !sessionId) {
      console.error("Missing query or sessionId:", { query, sessionId });
      return NextResponse.json(
        { response: "Invalid request. Please provide query and sessionId." },
        { status: 400 }
      );
    }

    // console.log("Dialogflow config:", {
    //   projectId,
    //   clientEmail: process.env.DIALOGFLOW_CLIENT_EMAIL,
    //   privateKeyExists: !!process.env.DIALOGFLOW_PRIVATE_KEY,
    // });

    // console.log("Processing chatbot query:", { query, sessionId });

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: "en-US",
        },
      },
    };

    // console.log("Sending request to Dialogflow:", sessionPath);
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    // console.log("Dialogflow response:", {
    //   intent: result.intent?.displayName,
    //   fulfillmentText: result.fulfillmentText,
    // });

    // Handle order status intent
    if (
      result.intent.displayName === "check_order_status" &&
      result.parameters.fields.order_id
    ) {
      const orderId = result.parameters.fields.order_id.stringValue;
      //   console.log("Querying order:", orderId);
      const order = await Order.findOne({ _id: orderId }).lean();
      if (order) {
        return NextResponse.json({
          response: `Order #${orderId.slice(-6)} is ${
            order.status
          }. Expected delivery: ${new Date(
            order.createdAt.getTime() + 60 * 60 * 1000
          ).toLocaleTimeString()}.`,
        });
      } else {
        return NextResponse.json({
          response:
            "Sorry, I couldn’t find that order. Please check the ID or contact support.",
        });
      }
    }

    // Return default Dialogflow response
    return NextResponse.json({
      response: result.fulfillmentText,
    });
  } catch (error) {
    console.error("Chatbot API error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      time: new Date().toISOString(),
    });
    return NextResponse.json(
      { response: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
