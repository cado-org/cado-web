import React, { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Suspense fallback={<div className="w-64 bg-[#171717]" />}>
          <AdminSidebar />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
          <AdminHeader />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
