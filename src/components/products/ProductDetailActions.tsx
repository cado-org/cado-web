"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { openEnquiryModal, addToCart } = useEnquiry();
  const [qty, setQty] = useState(product.min_order_quantity || 1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center space-x-4">
        <label className="text-xs font-bold text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setQty(Math.max((product.min_order_quantity || 1), qty - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-800">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => openEnquiryModal(product)}
          className="flex-1 py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Enquire on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-3.5 px-6 border font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition ${
            added
              ? "bg-green-50 border-green-500 text-green-700"
              : "border-gray-300 hover:border-[#D71920] hover:text-[#D71920] text-gray-800 bg-white"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span>Added to Enquiry List</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Enquiry List</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
