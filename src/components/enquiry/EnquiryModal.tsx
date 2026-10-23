"use client";

import React, { useState, useEffect } from "react";
import { useEnquiry } from "@/lib/context/EnquiryContext";
import { X, CheckCircle2, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export function EnquiryModal() {
  const { isModalOpen, closeEnquiryModal, activeEnquiryProduct } = useEnquiry();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    company_name: "",
    location: "",
    additional_requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    whatsapp_url: string;
    enquiry_id: string;
  } | null>(null);

  useEffect(() => {
    setErrorMessage("");
    setSuccessData(null);
  }, [activeEnquiryProduct, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Build items array
      const items = activeEnquiryProduct
        ? [
            {
              product_id: activeEnquiryProduct.id,
              product_name: activeEnquiryProduct.name,
              product_sku: activeEnquiryProduct.sku,
              requested_quantity: 1,
              packaging: activeEnquiryProduct.packaging_details,
            },
          ]
        : [
            {
              product_name: "General Building Materials Enquiry",
              requested_quantity: 1,
            },
          ];

      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || undefined,
        company_name: formData.company_name || undefined,
        location: formData.location,
        additional_requirements: formData.additional_requirements || undefined,
        items,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setSuccessData({
        whatsapp_url: data.whatsapp_url,
        enquiry_id: data.enquiry_id,
      });

      // Automatically open WhatsApp in a new tab
      if (data.whatsapp_url) {
        window.open(data.whatsapp_url, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-bold text-lg">Enquire on WhatsApp</h3>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="text-white/80 hover:text-white transition p-1 rounded-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Enquiry Saved Successfully!</h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your enquiry reference is{" "}
                <span className="font-mono font-bold text-gray-800">
                  #{successData.enquiry_id.slice(0, 8)}
                </span>
                . Please review and send your prefilled message on WhatsApp.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={successData.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-lg shadow transition"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Continue to WhatsApp
                </a>
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product preview if selected */}
              {activeEnquiryProduct && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {activeEnquiryProduct.main_image_url && (
                    <div className="w-14 h-14 relative shrink-0 bg-white rounded border border-gray-200 p-1">
                      <Image
                        src={activeEnquiryProduct.main_image_url}
                        alt={activeEnquiryProduct.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {activeEnquiryProduct.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activeEnquiryProduct.packaging_details || "Standard Packaging"}
                      {activeEnquiryProduct.sku && ` • SKU: ${activeEnquiryProduct.sku}`}
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    placeholder="Enter mobile number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Company / Contractor Name
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Delivery City / Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter delivery city or location"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Additional Project Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.additional_requirements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additional_requirements: e.target.value,
                    })
                  }
                  placeholder="Enter any additional requirements, notes, or delivery timeframe..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#D71920] hover:bg-[#B5121B] text-white font-bold rounded-lg shadow flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Continue to WhatsApp &rarr;</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Your enquiry is securely recorded before opening WhatsApp.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
