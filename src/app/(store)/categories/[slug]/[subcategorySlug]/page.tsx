import { permanentRedirect } from "next/navigation";

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subcategorySlug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subcategorySlug } = await params;
  permanentRedirect(`/shop/${slug}/${subcategorySlug}`);
}
