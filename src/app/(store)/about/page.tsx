import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, Headphones, Award, CheckCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const companyName = settings?.company_name || "CADO Building Products";

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">About Us</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-4">
          <span className="text-xs font-bold text-[#D71920] uppercase tracking-wider">
            About Our Company
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#191919]">
            {companyName}
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            CADO is a premier manufacturer and distributor of high-performance tile adhesives, construction chemicals, epoxy grouts, plumbing systems, and modern building materials. Designed for professionals and builders across India, our products ensure maximum tensile bond strength, chemical resistance, and long-lasting durability.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Engineered Quality</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Formulated to meet stringent IS 15477 standards for tile adhesives and waterproofing, guaranteeing zero slippage and superior adhesion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Direct Contractor Supply</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Supplying directly to builders, dealers, and large-scale infrastructure projects across Kerala and South India with reliable logistics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Technical Consultation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct technical guidance on product selection, subfloor preparation, mortar bed thickness, and epoxy application.
            </p>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="bg-[#171717] text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Have a project enquiry or bulk requirement?</h3>
            <p className="text-xs text-gray-400 mt-1">
              Contact our sales engineering team for personalized quotations and sample testing.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-[#D71920] hover:bg-[#B5121B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shrink-0 transition"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
