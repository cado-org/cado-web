import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Plus, Edit, Package, Search } from "lucide-react";
import { Product } from "@/types/database";
import { ProductTableActions } from "./ProductTableActions";

export default async function AdminProductsPage() {
  let products: Product[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(name), brand:brands(name)")
        .order("created_at", { ascending: false });
      products = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Products Catalog</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your tile adhesives, chemicals, packaging, and availability.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              No products found in the database.
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Add your first CADO product or run the seed script to import initial data.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/products/new"
                className="px-4 py-2 bg-[#D71920] text-white text-xs font-bold rounded"
              >
                Create Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU / Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Packaging</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 relative bg-gray-50 border border-gray-200 rounded shrink-0 p-1">
                          {product.main_image_url ? (
                            <Image
                              src={product.main_image_url}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-400">
                              CADO
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {product.name}
                          </span>
                          {product.is_featured && (
                            <span className="text-[10px] font-bold text-[#D71920] bg-red-50 px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-500">
                      {product.sku || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {(product as any).category?.name || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {(product as any).brand?.name || "CADO"}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {product.packaging_details || "—"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          product.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_active ? "Active" : "Draft"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <ProductTableActions product={product} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
