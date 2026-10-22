import { NextRequest, NextResponse } from "next/server";
import { getProducts, getCategories } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ products: [], categories: [] });
  }

  try {
    const [{ products }, allCategories] = await Promise.all([
      getProducts({ search: q, limit: 6 }),
      getCategories(),
    ]);

    const matchingCategories = allCategories
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 4);

    return NextResponse.json({
      products: products.slice(0, 6),
      categories: matchingCategories,
    });
  } catch (err: any) {
    console.error("Search API error:", err);
    return NextResponse.json({ products: [], categories: [] });
  }
}
