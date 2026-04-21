import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ message: "Upload endpoint ready" });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // In production, upload to S3/OSS and return URL
  // For dev, use base64 data URL or local storage
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  return NextResponse.json({ url: dataUrl });
}
