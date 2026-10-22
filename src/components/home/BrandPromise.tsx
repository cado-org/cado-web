import React from "react";
import Image from "next/image";
import { CheckCircle2, Shield, Layers, Headphones, Truck } from "lucide-react";
import { HomepageSection } from "@/types/database";

interface BrandPromiseProps {
  section?: HomepageSection | null;
}

export function BrandPromise({ section }: BrandPromiseProps) {
  const content = (section?.content as any) || {};
  const eyebrow = content.eyebrow || "WHY CHOOSE CADO";
  const heading = content.heading || "Built for a Stronger Tomorrow";
  const description =
    content.description ||
    "We are committed to providing high quality construction products and accessories that help professionals and homeowners build durable, beautiful and lasting spaces.";

  const benefits = content.benefits || [
    { title: "Quality Products", description: "Standardized brands", icon: Shield },
    { title: "Wide Range", description: "All building aspects", icon: Layers },
    { title: "Expert Support", description: "On WhatsApp", icon: Headphones },
    { title: "Reliable Supply", description: "Pan India", icon: Truck },
  ];

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Engineer & Construction Visual */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-lg bg-gray-900">
            <Image
              src="/images/projects/commercial-projects.svg"
              alt="CADO Construction Quality"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
              <div className="flex items-center space-x-2 text-white">
                <span className="font-black text-xl text-[#D71920]">CADO</span>
                <span className="text-xs uppercase font-bold tracking-widest text-gray-300">
                  Engineered For Excellence
                </span>
              </div>
            </div>
          </div>

          {/* Right Brand Pillars Content */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div>
              <span className="text-[#D71920] text-xs font-black tracking-widest uppercase">
                {eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#191919] tracking-tight mt-1">
                {heading}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3">
                {description}
              </p>
            </div>

            {/* 4 Benefit Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {benefits.map((b: any, i: number) => {
                const Icon = b.icon || CheckCircle2;
                return (
                  <div
                    key={i}
                    className="p-3.5 bg-red-50/50 rounded-xl border border-red-100/60 flex flex-col items-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#D71920] flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 leading-tight">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
