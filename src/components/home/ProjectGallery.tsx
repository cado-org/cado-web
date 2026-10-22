import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types/database";

interface ProjectGalleryProps {
  projects?: Project[];
}

export function ProjectGallery({ projects = [] }: ProjectGalleryProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#191919] tracking-tight">
              Project Inspiration
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              See how CADO products help build stronger and better spaces.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View More Projects</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {project.cover_image_url ? (
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    CADO Project
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#D71920] transition">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
                {project.location && (
                  <span className="text-[11px] font-semibold text-gray-400 mt-3 block">
                    {project.location}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
