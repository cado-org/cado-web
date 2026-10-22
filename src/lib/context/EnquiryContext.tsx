"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/database";

export interface EnquiryCartItem {
  product_id?: string;
  name: string;
  sku?: string | null;
  packaging?: string | null;
  quantity: number;
  image_url?: string | null;
}

interface EnquiryContextType {
  cart: EnquiryCartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productIdOrName: string) => void;
  updateQuantity: (productIdOrName: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  // Direct single-product enquiry modal
  isModalOpen: boolean;
  activeEnquiryProduct: Product | null;
  openEnquiryModal: (product?: Product | null) => void;
  closeEnquiryModal: () => void;
  // Multi-item cart drawer
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<EnquiryCartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEnquiryProduct, setActiveEnquiryProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cado_enquiry_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cado_enquiry_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => (product.id && item.product_id === product.id) || item.name === product.name
      );
      if (existing) {
        return prev.map((item) =>
          (product.id && item.product_id === product.id) || item.name === product.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            sku: product.sku,
            packaging: product.packaging_details,
            quantity: Math.max(quantity, 1),
            image_url: product.main_image_url,
          },
        ];
      }
    });
  };

  const removeFromCart = (productIdOrName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.product_id !== productIdOrName && item.name !== productIdOrName
      )
    );
  };

  const updateQuantity = (productIdOrName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productIdOrName);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productIdOrName || item.name === productIdOrName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const openEnquiryModal = (product?: Product | null) => {
    setActiveEnquiryProduct(product || null);
    setIsModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsModalOpen(false);
    setActiveEnquiryProduct(null);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <EnquiryContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isModalOpen,
        activeEnquiryProduct,
        openEnquiryModal,
        closeEnquiryModal,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
}
