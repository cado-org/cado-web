"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  MessageSquare,
  Phone,
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

  // Mobile drawer accordion states
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);

  const phone = settings?.primary_phone || "+91 75929 58909";
  const whatsappNumber = settings?.whatsapp_number || "917592958909";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello CADO Team, I would like to enquire about your building materials and products."
  )}`;

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

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
                        href={`/shop/${cat.slug}`}
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
                href="/brands/cado"
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

              {/* Mobile Menu Toggle (Three Lines) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-gray-700 hover:text-[#D71920] hover:bg-gray-100 rounded-lg transition cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Right-Side Navigation Drawer */}
      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Side Drawer Bar (Sliding in from Right) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[300px] sm:w-[340px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Top Drawer Header with Logo & Close Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="relative h-8 w-28">
            <Image
              src="/cado-logo.png"
              alt={settings?.company_name || "CADO"}
              fill
              className="object-contain object-left"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 -mr-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition"
          >
            Home
          </Link>

          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition"
          >
            Shop All Products
          </Link>

          <Link
            href="/brands/cado"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-bold text-[#D71920] bg-red-50/60 hover:bg-red-50 transition"
          >
            CADO Own Brand
          </Link>

          {/* Categories Accordion Dropdown */}
          <div className="rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition cursor-pointer"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  mobileCatOpen ? "rotate-180 text-[#D71920]" : ""
                }`}
              />
            </button>

            {mobileCatOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-gray-50/70 rounded-b-lg border-l-2 border-red-200 ml-3 my-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-[#D71920] hover:bg-white rounded transition"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2.5 py-1.5 text-xs font-bold text-[#D71920] hover:underline"
                >
                  View All Categories &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Brands Accordion Dropdown */}
          <div className="rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition cursor-pointer"
            >
              <span>Brands</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  mobileBrandOpen ? "rotate-180 text-[#D71920]" : ""
                }`}
              />
            </button>

            {mobileBrandOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-gray-50/70 rounded-b-lg border-l-2 border-red-200 ml-3 my-1">
                {brands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/brands/${b.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-[#D71920] hover:bg-white rounded transition"
                  >
                    {b.name}
                  </Link>
                ))}
                <Link
                  href="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2.5 py-1.5 text-xs font-bold text-[#D71920] hover:underline"
                >
                  View All Brands &rarr;
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition"
          >
            Project Gallery
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#D71920] transition"
          >
            Contact
          </Link>
        </div>

        {/* Bottom Drawer Footer: WhatsApp & Contact Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/90 space-y-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="flex items-center justify-between text-xs text-gray-600 px-1 pt-1">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 hover:text-[#D71920] font-medium transition"
            >
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{phone}</span>
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D71920] font-semibold hover:underline"
            >
              Help &amp; Support
            </Link>
          </div>
        </div>
      </div>

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
