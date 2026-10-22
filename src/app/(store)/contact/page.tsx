import React from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { MapPin, Phone, Mail, MessageSquare, Clock } from "lucide-react";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phone = settings?.primary_phone || "+91 75929 58909";
  const whatsapp = settings?.whatsapp_number || "917592958909";
  const email = settings?.support_email || "sales@cado.in";
  const address = settings?.business_address || "Mukkom, Calicut, Kerala 673602, India";

  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello CADO Team, I would like to get in touch regarding building materials and products."
  )}`;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xs">
          <span className="text-xs font-bold text-[#D71920] uppercase tracking-wider">
            Customer Support &amp; Bulk Orders
          </span>
          <h1 className="text-3xl font-black text-[#191919] mt-1">
            Get in Touch with CADO
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Reach out to our sales and technical support team for enquiries, quotations, dealer partnerships, and site delivery arrangements.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Direct Phone</h3>
            <a href={`tel:${phone}`} className="text-xs text-gray-600 hover:text-[#D71920] block font-semibold">
              {phone}
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">WhatsApp Enquiry</h3>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#25D366] hover:underline block font-semibold"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Email Address</h3>
            <a href={`mailto:${email}`} className="text-xs text-gray-600 hover:text-[#D71920] block font-semibold">
              {email}
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Business Hours</h3>
            <p className="text-xs text-gray-600">
              Mon - Sat: 8:30 AM - 7:00 PM
            </p>
          </div>
        </div>

        {/* Address Card & Map Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D71920] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Head Office &amp; Distribution Center</h3>
              <p className="text-xs text-gray-600 mt-1">{address}</p>
              <p className="text-xs text-gray-400 mt-0.5">Kerala &bull; South India Delivery Hub</p>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition shrink-0 flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
