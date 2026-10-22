"use client";

import React, { useState, useTransition } from "react";
import { SiteSettings } from "@/types/database";
import { saveSiteSettings } from "./actions";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: SiteSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SiteSettings>({
    website_name: initialSettings?.website_name || "CADO Building Products",
    company_name:
      initialSettings?.company_name || "CADO Building Products Private Limited",
    main_logo_url: initialSettings?.main_logo_url || "/images/cado-logo.svg",
    footer_logo_url:
      initialSettings?.footer_logo_url || "/images/cado-logo-white.svg",
    favicon_url: initialSettings?.favicon_url || "/favicon.ico",
    whatsapp_number: initialSettings?.whatsapp_number || "917592958909",
    primary_phone: initialSettings?.primary_phone || "+91 75929 58909",
    support_email: initialSettings?.support_email || "sales@cado.in",
    business_address:
      initialSettings?.business_address || "Mukkom, Calicut, Kerala 673602, India",
    social_links: {
      facebook: initialSettings?.social_links?.facebook || "https://facebook.com",
      instagram: initialSettings?.social_links?.instagram || "https://instagram.com",
      youtube: initialSettings?.social_links?.youtube || "https://youtube.com",
      linkedin: initialSettings?.social_links?.linkedin || "https://linkedin.com",
    },
    announcement_bar: {
      enabled: initialSettings?.announcement_bar?.enabled ?? true,
      text_items: initialSettings?.announcement_bar?.text_items || [
        "Quality Building Products",
        "Fast Enquiry on WhatsApp",
        "Trusted Brands",
        "Pan India Supply",
      ],
      link_items: initialSettings?.announcement_bar?.link_items || [
        { label: "About Us", url: "/about" },
        { label: "Contact", url: "/contact" },
        { label: "Track Enquiry", url: "/contact" },
      ],
    },
    default_seo: {
      title:
        initialSettings?.default_seo?.title ||
        "CADO Building Products | Premium Tile Adhesives & Construction Materials",
      description:
        initialSettings?.default_seo?.description ||
        "High performance tile adhesives, grouts, sealants and building supplies in Kerala and across India.",
    },
    show_pricing_globally: initialSettings?.show_pricing_globally ?? false,
    newsletter_enabled: initialSettings?.newsletter_enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveSiteSettings(formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Website Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure contact details, WhatsApp number, logos, and global branding.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition flex items-center space-x-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 text-xs rounded-xl border border-green-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Website settings updated successfully! Public pages updated.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Brand & Contact Info */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Contact &amp; WhatsApp Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              WhatsApp Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp_number}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp_number: e.target.value })
              }
              placeholder="e.g. 917592958909 (digits with country code)"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none font-mono"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Used as destination for all prefilled customer enquiry messages.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Primary Phone Number
            </label>
            <input
              type="text"
              value={formData.primary_phone}
              onChange={(e) =>
                setFormData({ ...formData, primary_phone: e.target.value })
              }
              placeholder="+91 75929 58909"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Support / Sales Email
            </label>
            <input
              type="email"
              value={formData.support_email}
              onChange={(e) =>
                setFormData({ ...formData, support_email: e.target.value })
              }
              placeholder="sales@cado.in"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Business Address
            </label>
            <input
              type="text"
              value={formData.business_address}
              onChange={(e) =>
                setFormData({ ...formData, business_address: e.target.value })
              }
              placeholder="Mukkom, Calicut, Kerala 673602"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
            />
          </div>
        </div>
      </div>


      {/* Announcement Bar Settings */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            Top Announcement Bar
          </h3>
          <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.announcement_bar.enabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcement_bar: {
                    ...formData.announcement_bar,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded text-[#D71920]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Announcement Items (Comma separated)
          </label>
          <input
            type="text"
            value={formData.announcement_bar.text_items.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                announcement_bar: {
                  ...formData.announcement_bar,
                  text_items: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
