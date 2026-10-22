"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category, Brand, Product, ProductSpecification } from "@/types/database";
import { ImageUploader } from "./ImageUploader";
import { saveProduct } from "@/app/admin/products/actions";
import { Plus, Trash2, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
  brands: Brand[];
}

export function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    sku: initialData?.sku || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    subcategory_id: initialData?.subcategory_id || "",
    brand_id: initialData?.brand_id || "",
    main_image_url: initialData?.main_image_url || "",
    main_image_public_id: initialData?.main_image_public_id || "",
    packaging_details: initialData?.packaging_details || "",
    min_order_quantity: initialData?.min_order_quantity || 1,
    price: initialData?.price || "",
    show_price: initialData?.show_price || false,
    availability_status: initialData?.availability_status || "in_stock",
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
  });

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    initialData?.specifications || [{ label: "", value: "" }]
  );

  // Get active subcategories based on chosen category
  const selectedCategory = categories.find((c) => c.id === formData.category_id);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const handleCategoryChange = (catId: string) => {
    // Clear subcategory if it doesn't belong to the newly selected category
    setFormData((prev) => ({
      ...prev,
      category_id: catId,
      subcategory_id: "",
    }));
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "label" | "value", text: string) => {
    const updated = [...specifications];
    updated[index][field] = text;
    setSpecifications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Filter empty specifications
    const cleanSpecs = specifications.filter((s) => s.label.trim() && s.value.trim());

    startTransition(async () => {
      const res = await saveProduct(
        {
          ...formData,
          specifications: cleanSpecs,
        },
        initialData?.id
      );

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-gray-500 hover:text-[#D71920] flex items-center space-x-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h2 className="text-xl font-black text-gray-900">
            {initialData ? `Edit Product: ${initialData.name}` : "Add New Building Product"}
          </h2>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center space-x-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Product</span>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* General Information */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. CADO Tile Adhesive 777"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              SKU / Product Code
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. CADO-TA-777"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Short Description (Card Summary)
          </label>
          <input
            type="text"
            value={formData.short_description}
            onChange={(e) =>
              setFormData({ ...formData, short_description: e.target.value })
            }
            placeholder="High bonding strength tile adhesive for floor & wall applications."
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Full Description &amp; Usage Instructions
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed application guidelines, mixing ratios, suitable substrates..."
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
          />
        </div>
      </div>

      {/* Category & Brand Association */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Classification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Subcategory
            </label>
            <select
              value={formData.subcategory_id}
              onChange={(e) =>
                setFormData({ ...formData, subcategory_id: e.target.value })
              }
              disabled={!formData.category_id || availableSubcategories.length === 0}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white disabled:bg-gray-100"
            >
              <option value="">
                {availableSubcategories.length === 0
                  ? "No subcategories available"
                  : "Select Subcategory"}
              </option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Brand
            </label>
            <select
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Product Imagery (Cloudinary)
        </h3>

        <ImageUploader
          label="Main Packaging / Product Image"
          value={formData.main_image_url}
          onChange={(url, publicId) =>
            setFormData({
              ...formData,
              main_image_url: url,
              main_image_public_id: publicId || "",
            })
          }
          onRemove={() =>
            setFormData({
              ...formData,
              main_image_url: "",
              main_image_public_id: "",
            })
          }
          folder="cado-products"
        />
      </div>

      {/* Specifications Builder */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            Technical Specifications
          </h3>
          <button
            type="button"
            onClick={handleAddSpecification}
            className="text-xs font-bold text-[#D71920] hover:text-[#B5121B] flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-2">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Label (e.g. Coverage / Bond Strength)"
                value={spec.label}
                onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Value (e.g. 50-60 sq.ft per 20kg bag)"
                value={spec.value}
                onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecification(idx)}
                className="p-2 text-gray-400 hover:text-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Packaging, Order Limits & Availability */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Packaging &amp; Supply Terms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Packaging Specification
            </label>
            <input
              type="text"
              value={formData.packaging_details}
              onChange={(e) =>
                setFormData({ ...formData, packaging_details: e.target.value })
              }
              placeholder="e.g. 20 kg HDPE Bag"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Minimum Order Quantity (MOQ)
            </label>
            <input
              type="number"
              min={1}
              value={formData.min_order_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  min_order_quantity: parseInt(e.target.value) || 1,
                })
              }
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Availability
            </label>
            <select
              value={formData.availability_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability_status: e.target.value as any,
                })
              }
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white"
            >
              <option value="in_stock">In Stock</option>
              <option value="made_to_order">Made to Order</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="w-4 h-4 text-[#D71920] rounded border-gray-300 focus:ring-[#D71920]"
            />
            <span>Mark as Featured Product</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-[#D71920] rounded border-gray-300 focus:ring-[#D71920]"
            />
            <span>Active &amp; Visible on Public Website</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
