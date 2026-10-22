"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, Power, Eye } from "lucide-react";
import { Product } from "@/types/database";
import { deleteProduct, toggleProductActive } from "./actions";

interface ProductTableActionsProps {
  product: Product;
}

export function ProductTableActions({ product }: ProductTableActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      startTransition(async () => {
        await deleteProduct(product.id);
      });
    }
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductActive(product.id, product.is_active);
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link
        href={`/products/${product.slug}`}
        target="_blank"
        className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition"
        title="View on store"
      >
        <Eye className="w-4 h-4" />
      </Link>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`p-1.5 rounded transition ${
          product.is_active
            ? "text-emerald-600 hover:bg-emerald-50"
            : "text-gray-400 hover:bg-gray-100"
        }`}
        title={product.is_active ? "Deactivate" : "Activate"}
      >
        <Power className="w-4 h-4" />
      </button>

      <Link
        href={`/admin/products/${product.id}/edit`}
        className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
        title="Edit product"
      >
        <Edit className="w-4 h-4" />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
        title="Delete product"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
