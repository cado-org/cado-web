import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920]">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Privacy Policy</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-black text-[#191919]">Privacy Policy</h1>
          <p>CADO Building Products respects your privacy. When you submit product enquiries or newsletter subscriptions on our website, we collect your name, phone number, email, and location solely to provide product quotations, bulk pricing, and requested updates.</p>

          <h2 className="text-base font-bold text-gray-900">Information Handling</h2>
          <p>We do not sell, rent, or trade your contact information to third parties. Customer data is stored securely in our database and accessed only by authorized CADO sales representatives.</p>

          <h2 className="text-base font-bold text-gray-900">Communication Preferences</h2>
          <p>You can request removal from our communications or ask questions regarding your saved enquiries by contacting us at sales@cado.in.</p>
        </div>
      </div>
    </div>
  );
}
