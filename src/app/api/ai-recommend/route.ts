import { NextResponse } from "next/server";
import { productDescriber } from "@/lib/ai/services/product-describer";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === "description") {
    const result = await productDescriber.generateDescription(
      body.name,
      body.imageUrl || "",
      body.petType,
      body.fabricType
    );
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown request type" }, { status: 400 });
}
