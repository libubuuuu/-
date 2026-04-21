import { NextResponse } from "next/server";
import { threeDGenerator } from "@/lib/ai/services/three-d-generator";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { imageUrl, skeletonType } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  try {
    const result = await threeDGenerator.generatePetModel(imageUrl, {
      skeletonType: skeletonType || "dog",
    });

    return NextResponse.json({ jobId: result.jobId });
  } catch (err) {
    console.error("3D generation failed:", err);
    return NextResponse.json({ error: "3D generation failed" }, { status: 500 });
  }
}
