import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-[#D71920] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Projects</span>
          </Link>
        </div>

        <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Main Cover Image */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-900">
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                priority
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <span className="bg-[#D71920] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {project.project_type}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black mt-2">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-4 border-b border-gray-100">
              {project.location && (
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#D71920]" />
                  <span>Location: <strong className="text-gray-800">{project.location}</strong></span>
                </div>
              )}
              {project.completion_date && (
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#D71920]" />
                  <span>Completion: <strong className="text-gray-800">{project.completion_date}</strong></span>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="prose text-sm text-gray-700 leading-relaxed max-w-none">
                <p>{project.description}</p>
              </div>
            )}

            {/* Project Gallery Images if present */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="pt-6">
                <h3 className="font-bold text-base text-gray-900 mb-4">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <Image
                        src={img.url}
                        alt={`Installation ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
