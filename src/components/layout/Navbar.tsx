"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Category, Brand, SiteSettings } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface NavbarProps {
  categories?: Category[];
  brands?: Brand[];
  settings?: SiteSettings | null;
}

export function Navbar({ categories = [], brands = [], settings }: NavbarProps) {
  const router = useRouter();
  const { cartCount, openCartDrawer } = useEnquiry();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const logoUrl = settings?.main_logo_url || "/images/cado-logo.svg";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* 1. Brand Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <div className="relative h-12 w-44">
              <Image
                src={logoUrl}
                alt="CADO Building Products"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#191919]">
            <Link href="/" className="hover:text-[#D71920] transition-colors">
              Home
            </Link>

            <Link href="/shop" className="hover:text-[#D71920] transition-colors">
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setCatDropdownOpen(true)}
              onMouseLeave={() => setCatDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#D71920] transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {catDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-2 z-50 animate-in fade-in-50 duration-100">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#D71920]"
                      onClick={() => setCatDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/shop"
                      className="block px-4 py-2 text-xs font-bold text-[#D71920] hover:bg-red-50"
                      onClick={() => setCatDropdownOpen(false)}
                    >
                      View All Categories &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setBrandDropdownOpen(true)}
              onMouseLeave={() => setBrandDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#D71920] transition-colors cursor-pointer"
              >
                <span>Brands</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {brandDropdownOpen && brands.length > 0 && (
                <div className="absolute top-full left-0 w-56 bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-2 z-50 animate-in fade-in-50 duration-100">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/brands/${b.slug}`}
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#D71920]"
                      onClick={() => setBrandDropdownOpen(false)}
                    >
                      {b.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/brands"
                      className="block px-4 py-2 text-xs font-bold text-[#D71920] hover:bg-red-50"
                      onClick={() => setBrandDropdownOpen(false)}
                    >
                      View All Brands &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop?brand=cado"
              className="text-[#D71920] font-bold hover:text-[#B5121B] transition-colors"
            >
              CADO Products
            </Link>

            <Link href="/projects" className="hover:text-[#D71920] transition-colors">
              Projects
            </Link>

            <Link href="/about" className="hover:text-[#D71920] transition-colors">
              About
            </Link>
          </nav>

          {/* 3. Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#F5F5F5] border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-[#D71920] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* 4. Action Icons: Account, Wishlist, Enquiry Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-[#D71920] p-1.5 transition"
              title="Admin Portal"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/shop"
              className="text-gray-600 hover:text-[#D71920] p-1.5 transition hidden sm:block"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart / Enquiry List Icon */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative p-1.5 text-gray-700 hover:text-[#D71920] transition cursor-pointer"
              title="View Enquiry List"
              aria-label="Enquiry List"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 bg-[#D71920] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-gray-700 hover:text-[#D71920]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F5F5F5] border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-[#D71920]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-5 space-y-4 animate-in slide-in-from-top-4 duration-150">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-[#191919]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              Shop All Products
            </Link>
            <Link
              href="/shop?brand=cado"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D71920] font-bold py-1"
            >
              CADO Own Brand
            </Link>
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              All Brands
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              Project Gallery
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#D71920] py-1"
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-gray-500 pt-2 border-t border-gray-100"
            >
              Admin Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
