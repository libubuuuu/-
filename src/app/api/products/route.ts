import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categories = searchParams.get("categories");

  if (categories) {
    const cats = await prisma.productCategory.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(cats);
  }

  const active = searchParams.get("active");
  const where = active ? { isActive: true } : {};

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      ...body,
      price: parseFloat(body.price),
      inventory: parseInt(body.inventory) || 0,
      isActive: !!body.isActive,
    },
  });

  return NextResponse.json(product);
}
