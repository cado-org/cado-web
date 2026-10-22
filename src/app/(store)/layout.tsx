import React from "react";
import { EnquiryProvider } from "@/lib/context/EnquiryContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnquiryModal } from "@/components/enquiry/EnquiryModal";
import { EnquiryCartDrawer } from "@/components/enquiry/EnquiryCartDrawer";
import { getCategories, getBrands, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, brands, settings] = await Promise.all([
    getCategories(),
    getBrands(),
    getSiteSettings(),
  ]);

  return (
    <EnquiryProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar settings={settings} />
        <Navbar categories={categories} brands={brands} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />

        {/* Global Modals & Drawers */}
        <EnquiryModal />
        <EnquiryCartDrawer />
      </div>
    </EnquiryProvider>
  );
}
