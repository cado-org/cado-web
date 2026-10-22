"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, GitFork, X } from "lucide-react";
import { Category } from "@/types/database";
import { saveSubcategory, deleteSubcategory } from "./actions";

interface SubcategoryManagerProps {
  subcategories: any[];
  categories: Category[];
}

export function SubcategoryManager({
  subcategories,
  categories,
}: SubcategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    slug: "",
    description: "",
    is_active: true,
    display_order: 0,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      category_id: selectedCatFilter || (categories[0]?.id ?? ""),
      name: "",
      slug: "",
      description: "",
      is_active: true,
      display_order: subcategories.length + 1,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      is_active: item.is_active,
      display_order: item.display_order || 0,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveSubcategory(formData, editingItem?.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      startTransition(async () => {
        await deleteSubcategory(id);
      });
    }
  };

  const filteredItems = selectedCatFilter
    ? subcategories.filter((s) => s.category_id === selectedCatFilter)
    : subcategories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Subcategories</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage granular product classifications linked to parent categories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Parent Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center">
            <GitFork className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              No subcategories found.
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Create subcategories to organize products under their parent categories.
            </p>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Subcategory</th>
                <th className="py-3 px-4">Parent Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">{sub.name}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {sub.category?.name || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{sub.slug}</td>
                  <td className="py-3 px-4 font-bold text-gray-700">{sub.display_order}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {sub.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(sub)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id, sub.name)}
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
                {editingItem ? `Edit: ${editingItem.name}` : "Create Subcategory"}
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
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
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
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tile on Tile Adhesives"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. tile-on-tile"
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

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-100">
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
                  {isPending ? "Saving..." : "Save Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
