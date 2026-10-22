import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920]">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Terms &amp; Conditions</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-black text-[#191919]">Terms &amp; Conditions</h1>
          <p>Last updated: 2026. Welcome to CADO Building Products.</p>

          <h2 className="text-base font-bold text-gray-900">1. Product Information and Quotations</h2>
          <p>All product specifications, coverage estimations, and packaging details provided on this website are indicative and based on manufacturer lab standards. Formal price quotations are confirmed directly through WhatsApp or email enquiry.</p>

          <h2 className="text-base font-bold text-gray-900">2. Enquiries and Ordering</h2>
          <p>Submitting an enquiry via this platform records your product requirements in our system and opens WhatsApp for order finalization. No financial payments are processed through this website.</p>

          <h2 className="text-base font-bold text-gray-900">3. Delivery and Site Supply</h2>
          <p>Delivery schedules and freight terms depend on destination, minimum order volume, and site accessibility, agreed upon quotation confirmation.</p>
        </div>
      </div>
    </div>
  );
}
