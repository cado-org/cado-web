"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

async function optimizeImageForUpload(file: File): Promise<File | Blob> {
  if (file.type === "image/svg+xml" || file.size <= 500 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_DIM = 1920;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  folder = "cado-ecommerce",
  label = "Upload Image",
  helperText = "PNG, JPG, SVG or WEBP up to 8MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const optimized = await optimizeImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimized);
      formData.append("folder", folder);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url, data.public_id);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualUrlChange = (urlStr: string) => {
    onChange(urlStr);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full max-w-sm h-48 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden p-2 flex items-center justify-center group">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            unoptimized
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => {
              if (onRemove) onRemove();
              else onChange("");
            }}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition shadow"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm h-40 border-2 border-dashed border-gray-300 hover:border-[#D71920] rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-red-50/10 transition text-center"
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2 text-[#D71920]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1 text-gray-500">
              <Upload className="w-7 h-7 text-gray-400 mb-1" />
              <span className="text-xs font-bold text-gray-700">
                Click to upload from device
              </span>
              <span className="text-[11px] text-gray-400">{helperText}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Manual URL input fallback */}
      <div className="pt-1">
        <input
          type="text"
          placeholder="Or paste external/local image URL (e.g. /images/...)"
          value={value || ""}
          onChange={(e) => handleManualUrlChange(e.target.value)}
          className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
        />
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-red-600 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
