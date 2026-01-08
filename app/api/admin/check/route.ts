import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");

  if (!cookie || !cookie.includes("admin=true")) {
    return NextResponse.json(
      { authorized: false },
      { status: 401 }
    );
  }

  return NextResponse.json({ authorized: true });
}
