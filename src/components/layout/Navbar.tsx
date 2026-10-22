"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Category, Brand, SiteSettings } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";
import { SearchModal } from "./SearchModal";

interface NavbarProps {
  categories?: Category[];
  brands?: Brand[];
  settings?: SiteSettings | null;
}

export function Navbar({ categories = [], brands = [], settings }: NavbarProps) {
  const { cartCount, openCartDrawer } = useEnquiry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* 1. Brand Logo: Official cado-logo.png */}
            <Link href="/" className="shrink-0 flex items-center mr-2">
              <div className="relative h-11 w-36 sm:w-44">
                <Image
                  src="/cado-logo.png"
                  alt={settings?.company_name || "CADO Building Products"}
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* 2. Desktop Navigation Links (Spacious and Uncongested) */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-semibold text-[#191919]">
              <Link href="/" className="hover:text-[#D71920] transition-colors py-2">
                Home
              </Link>

              <Link href="/shop" className="hover:text-[#D71920] transition-colors py-2">
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
                className="text-[#D71920] font-bold hover:text-[#B5121B] transition-colors py-2"
              >
                CADO Products
              </Link>

              <Link href="/projects" className="hover:text-[#D71920] transition-colors py-2">
                Projects
              </Link>

              <Link href="/about" className="hover:text-[#D71920] transition-colors py-2">
                About
              </Link>
            </nav>

            {/* 3. Right Action Items: Search Trigger + Enquiry Cart */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Modal Trigger Button (Desktop Pill) */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 rounded-full text-xs text-gray-600 transition cursor-pointer border border-gray-200/70"
                title="Search products, brands or categories"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-500">
                  Search products, brands...
                </span>
              </button>

              {/* Search Modal Trigger Button (Mobile: Icon only, no grey background) */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-1.5 text-gray-700 hover:text-[#D71920] transition cursor-pointer"
                title="Search products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart / Enquiry List Icon */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative p-2 text-gray-700 hover:text-[#D71920] transition cursor-pointer hover:bg-gray-100 rounded-full"
                title="View Enquiry List"
                aria-label="Enquiry List"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#D71920] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-700 hover:text-[#D71920] hover:bg-gray-100 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
            </nav>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
