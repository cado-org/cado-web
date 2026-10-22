"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, FolderTree, X, Loader2, Check } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveCategory, deleteCategory } from "./actions";

interface CategoryManagerProps {
  categories: any[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
      is_featured: false,
      display_order: categories.length + 1,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image_url: cat.image_url || "",
      is_active: cat.is_active,
      is_featured: cat.is_featured,
      display_order: cat.display_order || 0,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveCategory(formData, editingCategory?.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      startTransition(async () => {
        await deleteCategory(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Categories</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage primary product categories and department groupings.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-16 text-center">
            <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No categories found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add your first category or run the seed script to import default categories.
            </p>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 relative bg-gray-50 border border-gray-200 rounded shrink-0 p-1 flex items-center justify-center">
                        {cat.image_url ? (
                          <Image
                            src={cat.image_url}
                            alt={cat.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <FolderTree className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{cat.name}</span>
                        {cat.description && (
                          <span className="text-[11px] text-gray-400 line-clamp-1">
                            {cat.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-4 font-bold text-gray-700">{cat.display_order}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {cat.is_featured ? (
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
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                        title="Delete category"
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

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingCategory ? `Edit: ${editingCategory.name}` : "Create Category"}
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tile Adhesives"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Slug (Optional - Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. tile-adhesives"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Category Icon / Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="cado-categories"
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
                    <span>Featured Category</span>
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
                  {isPending ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
