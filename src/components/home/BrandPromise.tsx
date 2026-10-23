import React from "react";
import Image from "next/image";
import { Shield, Building2, Headphones, PackageCheck } from "lucide-react";
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
  const imageUrl = content.image_url || "/images/CADO-Tile-123.png";

  const benefits = [
    {
      title: "Quality Products",
      description: "From trusted brands",
      icon: Shield,
    },
    {
      title: "Wide Range",
      description: "For every project",
      icon: Building2,
    },
    {
      title: "Expert Support",
      description: "On WhatsApp",
      icon: Headphones,
    },
    {
      title: "Reliable Supply",
      description: "Pan India",
      icon: PackageCheck,
    },
  ];

  return (
    <section className="py-12 lg:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-none shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left: Product & Packaging Image (4:3 natural aspect ratio prevents cropping on desktop) */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
            <Image
              src={imageUrl}
              alt="Why Choose CADO - Construction Quality"
              fill
              className="object-contain sm:object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>

          {/* Right: Content and 4 Key Pillars in a row */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-[#D71920] text-xs font-black tracking-widest uppercase">
                {eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#191919] tracking-tight mt-1.5 leading-tight">
                {heading}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3 max-w-2xl">
                {description}
              </p>
            </div>

            {/* 4 Pillars with Red Circular Outline Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#D71920] flex items-center justify-center text-[#D71920] shrink-0 bg-red-50/30">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                        {b.description}
                      </p>
                    </div>
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
