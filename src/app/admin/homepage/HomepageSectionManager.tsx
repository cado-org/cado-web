"use client";

import React, { useState, useTransition } from "react";
import { Sliders, CheckCircle2, Edit, X, Power, Loader2 } from "lucide-react";
import { updateHomepageSection } from "./actions";

interface HomepageSectionManagerProps {
  sections: any[];
}

export function HomepageSectionManager({ sections }: HomepageSectionManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    is_enabled: true,
    display_order: 0,
  });

  const openEdit = (sec: any) => {
    setEditingSection(sec);
    setFormData({
      title: sec.title,
      subtitle: sec.subtitle || "",
      description: sec.description || "",
      is_enabled: sec.is_enabled,
      display_order: sec.display_order || 0,
    });
  };

  const handleToggle = (sec: any) => {
    startTransition(async () => {
      await updateHomepageSection(sec.id, {
        ...sec,
        is_enabled: !sec.is_enabled,
      });
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    startTransition(async () => {
      await updateHomepageSection(editingSection.id, {
        ...editingSection,
        ...formData,
      });
      setEditingSection(null);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Homepage Sections</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Enable or disable sections, change headlines, and customize content order.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs divide-y divide-gray-100">
        {sections.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs">
            No homepage sections configured.
          </div>
        ) : (
          sections.map((sec) => (
            <div
              key={sec.id}
              className="p-5 flex items-center justify-between hover:bg-gray-50/70 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    Order {sec.display_order}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    [{sec.section_key}]
                  </span>
                  <h3 className="font-bold text-sm text-gray-900">{sec.title}</h3>
                </div>
                {sec.description && (
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {sec.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleToggle(sec)}
                  disabled={isPending}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
                    sec.is_enabled
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{sec.is_enabled ? "Enabled" : "Disabled"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEdit(sec)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Edit section"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Drawer/Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                Edit Section: {editingSection.title}
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Subtitle / Eyebrow
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
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

              <div className="grid grid-cols-2 gap-4">
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

                <div className="pt-6">
                  <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_enabled}
                      onChange={(e) =>
                        setFormData({ ...formData, is_enabled: e.target.checked })
                      }
                      className="rounded border-gray-300 text-[#D71920]"
                    />
                    <span>Section Enabled</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5121B] text-white rounded text-xs font-bold uppercase tracking-wider"
                >
                  {isPending ? "Saving..." : "Save Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
