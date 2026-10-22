import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/data";
import { ArrowRight, MapPin } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Project Inspiration</span>
        </nav>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-xs">
          <span className="text-xs font-bold text-[#D71920] uppercase tracking-wider">
            Real Installation Showcase
          </span>
          <h1 className="text-3xl font-black text-[#191919] mt-1">
            Project Inspiration &amp; Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            See how CADO high-bonding tile adhesives, waterproofing chemicals, and epoxy grouts empower residential, commercial, and outdoor spaces across India.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/projects/${proj.slug}`}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col group"
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                {proj.cover_image_url ? (
                  <Image
                    src={proj.cover_image_url}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    CADO Project
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {proj.project_type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-[#D71920] transition">
                    {proj.title}
                  </h3>
                  {proj.description && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {proj.location ? (
                    <span className="text-gray-500 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>{proj.location}</span>
                    </span>
                  ) : <span />}

                  <span className="font-bold text-[#D71920] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
