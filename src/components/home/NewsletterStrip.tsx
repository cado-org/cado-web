"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setMessage({ text: data.message || "Thank you for subscribing!", type: "success" });
      setEmail("");
    } catch (err: any) {
      setMessage({
        text: err.message || "Could not complete subscription. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#D71920] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold leading-tight">
              Get Updated with New Products &amp; Offers
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              Be the first to know about our new arrivals, special offers and industry updates.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs text-gray-900 bg-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#B5121B] hover:bg-black/40 text-white font-bold text-xs uppercase tracking-wider rounded-md transition duration-150 flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-2 text-xs flex items-center space-x-1.5 ${
                message.type === "success" ? "text-green-200" : "text-yellow-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
