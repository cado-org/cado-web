import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package,
  Layers,
  Building2,
} from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const { products: relatedProducts } = await getProducts({
    categorySlug: product.category?.slug,
    limit: 4,
  });

  const otherProducts = relatedProducts.filter((p) => p.id !== product.id);

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2 flex-wrap">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D71920] transition">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#D71920] transition"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full aspect-square bg-[#F8FAFC] border border-gray-200 rounded-xl overflow-hidden p-6 flex items-center justify-center">
                {product.main_image_url ? (
                  <Image
                    src={product.main_image_url}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="text-gray-400 font-bold text-lg">CADO</div>
                )}

                {product.availability_status === "in_stock" && (
                  <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  <div className="w-16 h-16 relative rounded-lg border-2 border-[#D71920] bg-gray-50 p-1 shrink-0">
                    <Image
                      src={product.main_image_url || ""}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {product.gallery_images.map((img, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 relative rounded-lg border border-gray-200 bg-gray-50 p-1 shrink-0"
                    >
                      <Image
                        src={img.url}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Enquiry Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                {product.brand && (
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="inline-block text-xs font-bold uppercase tracking-wider text-[#D71920] bg-red-50 px-2.5 py-1 rounded mb-2 hover:bg-red-100 transition"
                  >
                    {product.brand.name}
                  </Link>
                )}

                <h1 className="text-2xl sm:text-3xl font-black text-[#191919] leading-tight">
                  {product.name}
                </h1>

                {product.sku && (
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    Product Code / SKU: <span className="font-bold text-gray-800">{product.sku}</span>
                  </p>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-[#D71920] pl-3 py-0.5">
                  {product.short_description}
                </p>
              )}

              {/* Key Attributes Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Packaging</span>
                  <span className="font-bold text-gray-800">
                    {product.packaging_details || "Standard Bag"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Availability</span>
                  <span className="font-bold text-green-700 capitalize">
                    {product.availability_status ? product.availability_status.replace(/_/g, " ") : "In Stock"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Category</span>
                  <span className="font-bold text-gray-800">
                    {product.category?.name || "Materials"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Client Component for Enquire Modal & Cart */}
              <ProductDetailActions product={product} />

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#D71920] shrink-0" />
                  <span>100% Genuine CADO Manufacturing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-[#D71920] shrink-0" />
                  <span>Direct Site Delivery &amp; Bulk Supply</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description & Specifications Tabs */}
          <div className="mt-12 pt-8 border-t border-gray-200 space-y-8">
            {product.description && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-3">
                  Product Overview
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed max-w-4xl space-y-3">
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">
                  Technical Specifications
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-w-3xl">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-gray-200">
                      {product.specifications.map((spec, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                        >
                          <td className="py-3 px-4 font-bold text-gray-700 w-1/3">
                            {spec.label}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-black text-[#191919] mb-6">
              Related Building Materials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
