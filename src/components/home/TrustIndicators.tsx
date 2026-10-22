import React from "react";
import { ShieldCheck, Truck, Headphones, Globe } from "lucide-react";
import { TrustIndicator } from "@/types/database";

interface TrustIndicatorsProps {
  indicators?: TrustIndicator[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#D71920]" />,
  Truck: <Truck className="w-6 h-6 text-[#D71920]" />,
  Headphones: <Headphones className="w-6 h-6 text-[#D71920]" />,
  Globe: <Globe className="w-6 h-6 text-[#D71920]" />,
};

export function TrustIndicators({ indicators }: TrustIndicatorsProps) {
  const items =
    indicators && indicators.length > 0
      ? indicators
      : [
          {
            id: "1",
            title: "Trusted Quality",
            description: "Reliable products",
            icon_name: "ShieldCheck",
            display_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "2",
            title: "Bulk Supply",
            description: "Best pricing",
            icon_name: "Truck",
            display_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "3",
            title: "Expert Support",
            description: "Quick response",
            icon_name: "Headphones",
            display_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "4",
            title: "Pan India Supply",
            description: "For industrial & real estate",
            icon_name: "Globe",
            display_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ];

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const icon =
              ICON_MAP[item.icon_name] || (
                <ShieldCheck className="w-6 h-6 text-[#D71920]" />
              );

            return (
              <div
                key={item.id || idx}
                className="flex items-center space-x-3.5 px-2"
              >
                <div className="p-2.5 bg-red-50 rounded-lg shrink-0">
                  {icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
