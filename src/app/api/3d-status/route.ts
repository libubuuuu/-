import { NextResponse } from "next/server";
import { threeDGenerator } from "@/lib/ai/services/three-d-generator";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const status = await threeDGenerator.checkJobStatus(jobId);
  return NextResponse.json(status);
}
