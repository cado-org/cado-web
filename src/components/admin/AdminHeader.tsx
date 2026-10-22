"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User, Shield } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Generate simple breadcrumb title from path
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);
  const title = segments[0]
    ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace("-", " ")
    : "Dashboard";

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base font-black text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              CADO Admin Control Panel
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
            <Shield className="w-4 h-4 text-[#D71920]" />
            <span className="text-xs font-bold text-gray-700">Administrator</span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#171717] flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
