import React from "react";
import Link from "next/link";
import { SiteSettings } from "@/types/database";

interface AnnouncementBarProps {
  settings?: SiteSettings | null;
}

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const barConfig = settings?.announcement_bar;

  // If explicitly disabled in admin settings, do not render
  if (barConfig && !barConfig.enabled) {
    return null;
  }

  const textItems = barConfig?.text_items || [
    "Quality Building Products",
    "Fast Enquiry on WhatsApp",
    "Trusted Brands",
    "Pan India Supply",
  ];

  const linkItems = barConfig?.link_items || [
    { label: "About Us", url: "/about" },
    { label: "Contact", url: "/contact" },
    { label: "Track Enquiry", url: "/contact" },
  ];

  return (
    <div className="bg-[#D71920] text-white text-[11px] font-medium py-1.5 px-4 tracking-wide border-b border-red-700/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left items */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
          {textItems.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item}</span>
              {index < textItems.length - 1 && (
                <span className="text-white/40">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right navigation links */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {linkItems.map((item, index) => (
            <React.Fragment key={index}>
              <Link
                href={item.url}
                className="hover:text-white/80 transition-colors"
              >
                {item.label}
              </Link>
              {index < linkItems.length - 1 && (
                <span className="text-white/40">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
