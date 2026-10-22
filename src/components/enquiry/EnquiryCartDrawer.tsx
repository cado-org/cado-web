"use client";

import React, { useState } from "react";
import { useEnquiry } from "@/lib/context/EnquiryContext";
import { X, Trash2, Plus, Minus, MessageSquare, Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export function EnquiryCartDrawer() {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useEnquiry();

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
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const items = cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        product_sku: item.sku,
        requested_quantity: item.quantity,
        packaging: item.packaging,
      }));

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

      setSuccessUrl(data.whatsapp_url);
      clearCart();

      if (data.whatsapp_url) {
        window.open(data.whatsapp_url, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#D71920] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-lg">Enquiry List ({cart.length})</h3>
          </div>
          <button
            onClick={closeCartDrawer}
            className="text-white/80 hover:text-white p-1 rounded-md"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {successUrl ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h4 className="text-xl font-bold text-gray-900">Enquiry Recorded!</h4>
              <p className="text-sm text-gray-600">
                Your multi-product enquiry has been saved. Please review and send your message on WhatsApp.
              </p>
              <div className="pt-4 space-y-2">
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-lg shadow flex items-center justify-center space-x-2 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Open in WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSuccessUrl(null);
                    closeCartDrawer();
                  }}
                  className="w-full py-2.5 text-gray-600 text-sm font-semibold hover:bg-gray-100 rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-700">Your enquiry list is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Browse our building materials catalog and click &ldquo;Add to Enquiry&rdquo; to request quotes for multiple products together.
              </p>
              <div className="pt-4">
                <button
                  onClick={closeCartDrawer}
                  className="px-5 py-2.5 bg-[#D71920] text-white text-xs font-bold uppercase rounded-md tracking-wider hover:bg-[#B5121B] transition"
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Items List */}
              <div className="space-y-3 divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center space-x-3">
                    {item.image_url ? (
                      <div className="w-14 h-14 relative shrink-0 bg-gray-50 border border-gray-200 rounded p-1">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 shrink-0 bg-gray-100 rounded flex items-center justify-center text-gray-400 font-bold text-xs">
                        CADO
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                      {item.packaging && (
                        <p className="text-xs text-gray-500">{item.packaging}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product_id || item.name, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product_id || item.name, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id || item.name)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                  Your Contact Details
                </h5>

                {errorMessage && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorMessage}</p>
                )}

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company (Optional)"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Delivery City *"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Special instructions or questions..."
                  value={formData.additional_requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, additional_requirements: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#D71920] hover:bg-[#B5121B] text-white font-bold text-sm rounded shadow flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Enquire on WhatsApp &rarr;</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
