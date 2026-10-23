"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Image as ImageIcon, X, ArrowRight } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveBanner, deleteBanner } from "./actions";

interface BannerManagerProps {
  banners: any[];
}

export function BannerManager({ banners }: BannerManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    eyebrow: "BUILD BETTER WITH CADO",
    title: "",
    description: "",
    desktop_image_url: "",
    mobile_image_url: "",
    primary_cta_label: "Shop CADO Products",
    primary_cta_url: "/brands/cado",
    secondary_cta_label: "Enquire on WhatsApp",
    secondary_cta_url: "whatsapp",
    overlay_opacity: 0.4,
    display_order: 0,
    is_active: true,
  });

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      eyebrow: "BUILD BETTER WITH CADO",
      title: "",
      description: "",
      desktop_image_url: "/images/hero/hero-tile-installation.svg",
      mobile_image_url: "",
      primary_cta_label: "Shop CADO Products",
      primary_cta_url: "/brands/cado",
      secondary_cta_label: "Enquire on WhatsApp",
      secondary_cta_url: "whatsapp",
      overlay_opacity: 0.4,
      display_order: banners.length + 1,
      is_active: true,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingBanner(b);
    setFormData({
      eyebrow: b.eyebrow || "",
      title: b.title,
      description: b.description || "",
      desktop_image_url: b.desktop_image_url,
      mobile_image_url: b.mobile_image_url || "",
      primary_cta_label: b.primary_cta_label || "",
      primary_cta_url: b.primary_cta_url || "",
      secondary_cta_label: b.secondary_cta_label || "",
      secondary_cta_url: b.secondary_cta_url || "",
      overlay_opacity: b.overlay_opacity || 0.4,
      display_order: b.display_order || 0,
      is_active: b.is_active,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveBanner(formData, editingBanner?.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete banner "${title}"?`)) {
      startTransition(async () => {
        await deleteBanner(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Hero Banners</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage homepage carousel slides, desktop and mobile hero photography.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner Slide</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-16 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No banners found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add your first hero banner slide to feature on the homepage.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-16 relative bg-gray-900 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={banner.desktop_image_url}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    {banner.eyebrow && (
                      <span className="text-[10px] font-bold uppercase text-[#D71920] block">
                        {banner.eyebrow}
                      </span>
                    )}
                    <h3 className="font-bold text-sm text-gray-900 leading-snug">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-lg mt-0.5">
                      {banner.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      banner.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.is_active ? "Active" : "Disabled"}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(banner)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(banner.id, banner.title)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingBanner ? `Edit Banner: ${editingBanner.title}` : "Add Banner"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded">
                  {errorMessage}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Eyebrow Text (Small Uppercase Tag)
                </label>
                <input
                  type="text"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  placeholder="e.g. BUILD BETTER WITH CADO"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Main Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Premium Tile Adhesives for Stronger Spaces"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Supporting Description
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
                label="Desktop Hero Banner (16:9 Ratio recommended) *"
                helperText="16:9 landscape format (e.g. 1920x1080, max 8MB)"
                value={formData.desktop_image_url}
                onChange={(url) => setFormData({ ...formData, desktop_image_url: url })}
                folder="cado-hero"
              />

              <ImageUploader
                label="Mobile Hero Banner (9:16 Ratio recommended)"
                helperText="9:16 portrait format for phones (e.g. 1080x1920, max 8MB)"
                value={formData.mobile_image_url}
                onChange={(url) => setFormData({ ...formData, mobile_image_url: url })}
                folder="cado-hero"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_label}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_cta_label: e.target.value })
                    }
                    placeholder="Shop CADO Products"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Primary CTA URL
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_url}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_cta_url: e.target.value })
                    }
                    placeholder="/brands/cado"
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
                  {isPending ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
