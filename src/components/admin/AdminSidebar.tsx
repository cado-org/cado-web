"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  GitFork,
  Award,
  MessageSquare,
  Image as ImageIcon,
  Sliders,
  FolderKanban,
  ShieldCheck,
  Mail,
  Settings,
  Users,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Subcategories", href: "/admin/subcategories", icon: GitFork },
    { label: "Brands", href: "/admin/brands", icon: Award },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Hero Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Homepage Sections", href: "/admin/homepage", icon: Sliders },
    { label: "Project Gallery", href: "/admin/projects", icon: FolderKanban },
    { label: "Trust Indicators", href: "/admin/trust-indicators", icon: ShieldCheck },
    { label: "Newsletter Subscribers", href: "/admin/newsletter", icon: Mail },
    { label: "Website Settings", href: "/admin/settings", icon: Settings },
    { label: "Admin Users", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#171717] text-white flex flex-col h-full shrink-0 border-r border-neutral-800">
      {/* Sidebar Brand */}
      <div className="h-16 px-6 border-b border-neutral-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="font-black text-xl text-[#D71920] tracking-wider">
            CADO
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-neutral-800 px-2 py-0.5 rounded">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-[#D71920] text-white font-bold"
                  : "text-gray-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
        >
          <span className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={async () => {
            document.cookie = "cado_admin_dev_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            try {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              if (supabase) await supabase.auth.signOut();
            } catch {
              // ignore
            }
            router.push("/admin/login");
            router.refresh();
          }}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-neutral-800 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
