"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Award, X, ExternalLink } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveBrand, deleteBrand } from "./actions";

interface BrandManagerProps {
  brands: any[];
}

export function BrandManager({ brands }: BrandManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo_url: "",
    website_url: "",
    is_featured: false,
    is_active: true,
    display_order: 0,
  });

  const isLimitReached = brands.length >= 10;

  const openCreateModal = () => {
    if (brands.length >= 10) {
      alert("Maximum limit of 10 brands reached. Please edit or delete an existing brand.");
      return;
    }
    setEditingBrand(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo_url: "",
      website_url: "",
      is_featured: false,
      is_active: true,
      display_order: brands.length + 1,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingBrand(b);
    setFormData({
      name: b.name,
      slug: b.slug,
      description: b.description || "",
      logo_url: b.logo_url || "",
      website_url: b.website_url || "",
      is_featured: b.is_featured,
      is_active: b.is_active,
      display_order: b.display_order || 0,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveBrand(formData, editingBrand?.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete brand "${name}"?`)) {
      startTransition(async () => {
        await deleteBrand(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-gray-900">Brands</h2>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isLimitReached
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {brands.length} / 10 Brands
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage authorized manufacturer brands (maximum limit of 10 brands).
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={isLimitReached}
          className={`inline-flex items-center px-4 py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5 ${
            isLimitReached
              ? "bg-gray-400 cursor-not-allowed opacity-60"
              : "bg-[#D71920] hover:bg-[#B5121B]"
          }`}
          title={isLimitReached ? "Maximum limit of 10 brands reached" : "Add Brand"}
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {brands.length === 0 ? (
          <div className="p-16 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No brands found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add manufacturer brands or run the seed script to import default brands.
            </p>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Website</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-8 relative bg-white border border-gray-200 rounded shrink-0 p-1 flex items-center justify-center">
                        {b.logo_url ? (
                          <Image
                            src={b.logo_url}
                            alt={b.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-bold text-[10px] text-gray-700">{b.name}</span>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{b.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-gray-500">{b.slug}</td>

                  <td className="py-3 px-4">
                    {b.website_url ? (
                      <a
                        href={b.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <span className="truncate max-w-[150px]">{b.website_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-700">{b.display_order}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {b.is_featured ? (
                      <span className="text-[10px] font-bold text-[#D71920] bg-red-50 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingBrand ? `Edit: ${editingBrand.name}` : "Add Brand"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded">
                  {errorMessage}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Supreme Pipes"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  placeholder="https://supreme.co.in"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Brand Logo"
                value={formData.logo_url}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, logo_url: url }))
                }
                onRemove={() =>
                  setFormData((prev) => ({ ...prev, logo_url: "" }))
                }
                folder="cado-brands"
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>

                <div className="space-y-2 pt-5">
                  <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="rounded border-gray-300 text-[#D71920]"
                    />
                    <span>Featured Brand</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="rounded border-gray-300 text-[#D71920]"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5121B] text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  {isPending ? "Saving..." : "Save Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
