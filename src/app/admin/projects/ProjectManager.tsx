"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, FolderKanban, X, MapPin } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveProject, deleteProject } from "./actions";

interface ProjectManagerProps {
  projects: any[];
}

export function ProjectManager({ projects }: ProjectManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    project_type: "Residential Projects",
    description: "",
    location: "",
    cover_image_url: "",
    completion_date: "",
    display_order: 0,
    is_active: true,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      project_type: "Residential Projects",
      description: "",
      location: "Kerala",
      cover_image_url: "/images/projects/residential-floors.svg",
      completion_date: "2026",
      display_order: projects.length + 1,
      is_active: true,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingItem(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      project_type: p.project_type || "Residential",
      description: p.description || "",
      location: p.location || "",
      cover_image_url: p.cover_image_url,
      completion_date: p.completion_date || "",
      display_order: p.display_order || 0,
      is_active: p.is_active,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveProject(formData, editingItem?.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete project "${title}"?`)) {
      startTransition(async () => {
        await deleteProject(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Project Gallery</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage site installation photos and architectural case studies.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-16 text-center">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No projects found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add installation photography to inspire residential and commercial clients.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="relative w-full h-36 bg-gray-100">
                    {proj.cover_image_url && (
                      <Image
                        src={proj.cover_image_url}
                        alt={proj.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {proj.project_type}
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-xs text-gray-900 line-clamp-1">
                      {proj.title}
                    </h3>
                    {proj.location && (
                      <span className="text-[10px] text-gray-500 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#D71920]" />
                        <span>{proj.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      proj.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {proj.is_active ? "Active" : "Hidden"}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id, proj.title)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingItem ? `Edit Project: ${editingItem.title}` : "Add Project"}
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
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Residential Floors"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Project Type
                  </label>
                  <input
                    type="text"
                    value={formData.project_type}
                    onChange={(e) =>
                      setFormData({ ...formData, project_type: e.target.value })
                    }
                    placeholder="Residential / Commercial"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Calicut, Kerala"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>
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
                label="Cover Image *"
                value={formData.cover_image_url}
                onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                folder="cado-projects"
              />

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
                  {isPending ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
