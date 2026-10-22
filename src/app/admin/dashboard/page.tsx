import React from "react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  Package,
  FolderTree,
  Award,
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Enquiry, Product } from "@/types/database";

export default async function AdminDashboardPage() {
  let totalProducts = 0;
  let activeProducts = 0;
  let totalCategories = 0;
  let totalBrands = 0;
  let totalEnquiries = 0;
  let newEnquiries = 0;
  let recentEnquiries: Enquiry[] = [];
  let recentProducts: Product[] = [];
  const isDbConnected = isSupabaseConfigured();

  if (isDbConnected) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      try {
        const [
          { count: prodCount },
          { count: activeProdCount },
          { count: catCount },
          { count: brandCount },
          { count: enqCount },
          { count: newEnqCount },
          { data: enqData },
          { data: prodData },
        ] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("brands").select("*", { count: "exact", head: true }),
          supabase.from("enquiries").select("*", { count: "exact", head: true }),
          supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("products").select("*").order("updated_at", { ascending: false }).limit(5),
        ]);

        totalProducts = prodCount || 0;
        activeProducts = activeProdCount || 0;
        totalCategories = catCount || 0;
        totalBrands = brandCount || 0;
        totalEnquiries = enqCount || 0;
        newEnquiries = newEnqCount || 0;
        recentEnquiries = enqData || [];
        recentProducts = prodData || [];
      } catch (e) {
        console.error("Dashboard metrics error:", e);
      }
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* DB Connection Notice if not configured */}
      {!isDbConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-800 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Supabase Database Credentials Required</h4>
            <p className="text-amber-700">
              To connect your real database, copy <code>.env.example</code> to <code>.env.local</code> and provide your real Supabase project URL and keys.
              Then execute <code>supabase/migrations/001_initial_schema.sql</code> and optionally <code>supabase/seed-development.sql</code> in the Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-gray-900">{totalProducts}</span>
              <span className="text-xs text-emerald-600 font-bold">
                ({activeProducts} Active)
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-gray-900">{totalCategories}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Brands
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-gray-900">{totalBrands}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Enquiries
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-gray-900">{totalEnquiries}</span>
              {newEnquiries > 0 && (
                <span className="text-xs bg-[#D71920] text-white font-bold px-1.5 py-0.5 rounded">
                  {newEnquiries} New
                </span>
              )}
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two-Column Activity Feeds: Recent Enquiries + Recent Product Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#D71920]" />
              <h3 className="text-sm font-bold text-gray-900">
                Recent Customer Enquiries
              </h3>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#D71920] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">
              No enquiries submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{enq.customer_name}</h4>
                    <p className="text-[11px] text-gray-500">
                      {enq.customer_phone} &bull; {enq.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.status === "new"
                          ? "bg-red-50 text-[#D71920]"
                          : enq.status === "contacted"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Product Updates */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#D71920]" />
              <h3 className="text-sm font-bold text-gray-900">
                Recent Product Updates
              </h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#D71920] hover:underline flex items-center space-x-1"
            >
              <span>Manage Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">
              No products found in the database.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{p.name}</h4>
                    {p.sku && <p className="text-[11px] font-mono text-gray-400">{p.sku}</p>}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.is_active ? "Active" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
