"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageSquare, Plus, Minus } from "lucide-react";
import { SiteSettings } from "@/types/database";

interface FooterProps {
  settings?: SiteSettings | null;
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/**
 * Mobile: heading with + / - icon, links drop down on tap.
 * md and up: normal always-open column, heading not clickable.
 */
function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:py-0 md:mb-4 md:pointer-events-none md:cursor-default"
      >
        <h4 className="text-xs font-bold uppercase tracking-widest text-white">
          {title}
        </h4>
        <span className="md:hidden text-gray-400">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <div className={`${open ? "block" : "hidden"} pb-4 md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}

export function Footer({ settings }: FooterProps) {
  const companyName = settings?.company_name || "CADO Building Products";
  const phone = settings?.primary_phone || "+91 75929 58909";
  const whatsappNumber = settings?.whatsapp_number || "917592958909";
  const email = settings?.support_email || "sales@cado.in";
  const address = settings?.business_address || "Mukkom, Calicut, Kerala 673602";
  const footerLogo = settings?.footer_logo_url || "/images/cado-logo-white.svg";

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello CADO Team, I would like to enquire about your building materials and products."
  )}`;

  return (
    <footer className="bg-[#171717] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-10 pb-12 border-b border-neutral-800">
          {/* 1. Brand Column */}
          <div className="space-y-4 pb-4 md:pb-0">
            <div className="inline-block bg-white p-2.5 rounded-xl shadow-xs">
              <div className="relative h-10 w-40">
                <Image
                  src="/cado-logo.png"
                  alt={companyName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The trusted destination for quality building products, fittings, construction chemicals and more.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-gray-400">
              <a
                href={settings?.social_links?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#D71920] hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.social_links?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#D71920] hover:text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.social_links?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#D71920] hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Shop Links */}
          <FooterAccordion title="Shop">
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=cado" className="hover:text-white transition">
                  CADO Products
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=offers" className="hover:text-white transition">
                  Offers
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 3. Customer Support */}
          <FooterAccordion title="Customer Support">
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Track Enquiry
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Bulk Enquiries
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 4. Company */}
          <FooterAccordion title="Company">
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 5. Get in Touch (always visible) */}
          <div className="space-y-3 pt-4 md:pt-0">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Get in Touch
            </h4>
            <div className="flex items-start space-x-2 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Phone className="w-4 h-4 text-[#D71920] shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-white transition">
                {phone}
              </a>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Mail className="w-4 h-4 text-[#D71920] shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition">
                {email}
              </a>
            </div>

            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold rounded shadow transition"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 CADO. All rights reserved.</p>
          <p className="text-gray-400">
            Made for a stronger tomorrow. Build with CADO.
          </p>
        </div>
      </div>
    </footer>
  );
}