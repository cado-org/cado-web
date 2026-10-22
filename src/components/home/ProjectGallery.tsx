"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/types/database";

interface ProjectGalleryProps {
  projects?: Project[];
}

export function ProjectGallery({ projects = [] }: ProjectGalleryProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const projectItems = projects.slice(0, 4);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto sliding: advances until the user touches/interacts with mobile screen
  useEffect(() => {
    if (!autoPlay || projectItems.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % projectItems.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: next * scrollRef.current.clientWidth,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, projectItems.length]);

  // When user touches the carousel, stop auto-play permanently
  const handleTouchStart = () => {
    setAutoPlay(false);
  };

  // Sync dots dynamically with scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    if (width > 0) {
      const pageIndex = Math.round(scrollLeft / width);
      setActiveIdx(pageIndex);
    }
  };

  const scrollToProject = (idx: number) => {
    setAutoPlay(false);
    setActiveIdx(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: idx * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#191919] tracking-tight">
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

        {/* 1. MOBILE VIEW: FULL TOUCH-SWIPE SCROLL SNAP (STOPS AUTO-MOVE ON TOUCH) */}
        <div className="md:hidden select-none">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projectItems.map((project) => (
              <div
                key={project.id}
                className="w-full shrink-0 snap-center px-1"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition active:scale-[0.98]"
                >
                  {/* Project Image */}
                  <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                    {project.cover_image_url ? (
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                        CADO Project
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-gray-900 leading-snug">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    {project.location && (
                      <span className="text-[11px] font-semibold text-[#D71920] mt-3 block">
                        📍 {project.location}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Dots & Navigation Controls for Mobile */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center space-x-1.5">
              {projectItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToProject(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? "w-6 bg-[#D71920]" : "w-1.5 bg-gray-300"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  scrollToProject(
                    (activeIdx - 1 + projectItems.length) % projectItems.length
                  )
                }
                className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-600 active:bg-gray-100"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  scrollToProject((activeIdx + 1) % projectItems.length)
                }
                className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-600 active:bg-gray-100"
                aria-label="Next project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. DESKTOP VIEW: 4 CARDS GRID */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectItems.map((project) => (
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
