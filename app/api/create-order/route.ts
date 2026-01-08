import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🔍 DEBUG: log env availability
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET ? "SET" : "MISSING");

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json(
        { error: "Razorpay keys missing" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
