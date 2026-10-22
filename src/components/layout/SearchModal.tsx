"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, FolderTree } from "lucide-react";
import { Product, Category } from "@/types/database";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_TAGS = [
  "CADO Tile Adhesive 777",
  "CADO Tile Adhesive 666",
  "Epoxy Grout",
  "Tile Adhesive",
  "Waterproofing",
  "Jaquar",
  "Astral Pipes",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setProducts([]);
      setCategories([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search query
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 animate-in zoom-in-95 fade-in-50 duration-200 flex flex-col max-h-[85vh]">
        {/* Search Header */}
        <form onSubmit={handleSubmit} className="relative border-b border-gray-100 flex items-center p-4 sm:p-5">
          <Search className="w-5 h-5 text-gray-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, adhesives, grouts..."
            className="w-full pl-3 pr-10 text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#D71920] animate-spin shrink-0 mr-3" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition shrink-0"
            title="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Popular quick tags when query is short or empty */}
          {!query.trim() && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-[#D71920] hover:border-red-200 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Matches */}
          {categories.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50 transition border border-gray-100"
                  >
                    <FolderTree className="w-4 h-4 text-[#D71920]" />
                    <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Products ({products.length})
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-[#D71920] hover:underline flex items-center space-x-1"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={onClose}
                    className="flex items-center space-x-3.5 p-2.5 rounded-xl hover:bg-gray-50 transition border border-gray-100 group"
                  >
                    <div className="w-12 h-12 relative bg-gray-50 rounded-lg overflow-hidden shrink-0 p-1 flex items-center justify-center">
                      {prod.main_image_url ? (
                        <Image
                          src={prod.main_image_url}
                          alt={prod.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="text-[10px] text-gray-400 font-bold">CADO</div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#D71920] transition truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {prod.packaging_details || "Standard Pack"}
                        {prod.sku && ` • SKU: ${prod.sku}`}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D71920] group-hover:translate-x-0.5 transition shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim() && !loading && products.length === 0 && categories.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-gray-800">
                No matching results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching with different keywords like adhesive, grout, or brands.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Press <strong>Enter</strong> to search all</span>
          <span>Press <strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>
  );
}
