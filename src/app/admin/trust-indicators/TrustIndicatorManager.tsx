"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, ShieldCheck, X } from "lucide-react";
import { saveTrustIndicator, deleteTrustIndicator } from "./actions";

interface TrustIndicatorManagerProps {
  indicators: any[];
}

export function TrustIndicatorManager({ indicators }: TrustIndicatorManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "ShieldCheck",
    display_order: 0,
    is_active: true,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      icon_name: "ShieldCheck",
      display_order: indicators.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon_name: item.icon_name || "ShieldCheck",
      display_order: item.display_order || 0,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveTrustIndicator(formData, editingItem?.id);
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete trust claim "${title}"?`)) {
      startTransition(async () => {
        await deleteTrustIndicator(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Trust Indicators</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage the 4 trust claim badges displayed under the hero banner.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Indicator</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100">
        {indicators.map((ind) => (
          <div
            key={ind.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50/70 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{ind.title}</h4>
                <p className="text-xs text-gray-500">{ind.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  ind.is_active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {ind.is_active ? "Active" : "Disabled"}
              </span>

              <button
                type="button"
                onClick={() => openEditModal(ind)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ind.id, ind.title)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingItem ? `Edit: ${editingItem.title}` : "Add Indicator"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Trusted Quality"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. Reliable products"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) =>
                      setFormData({ ...formData, icon_name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white"
                  >
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Truck">Truck (Delivery)</option>
                    <option value="Headphones">Headphones (Support)</option>
                    <option value="Globe">Globe (Pan India)</option>
                  </select>
                </div>

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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
