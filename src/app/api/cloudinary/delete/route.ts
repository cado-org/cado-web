import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromCloudinary } from "@/lib/cloudinary/client";
import { isCloudinaryConfigured } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 503 }
      );
    }

    const { public_id } = await req.json();
    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    const success = await deleteImageFromCloudinary(public_id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
