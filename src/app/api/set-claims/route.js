import admin from "@/libs/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, role } = await req.json();
    await admin.auth().setCustomUserClaims(uid, { role });
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error setting claims:", error);
    return Response.json({ error: "Failed to set claims" }, { status: 500 });
  }
}
