"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isConfiguredAdmin =
        email.trim().toLowerCase() === "admin@cado.in" && password === "web-cado1066";

      if (isConfiguredAdmin) {
        document.cookie =
          "cado_admin_dev_session=authenticated; path=/; max-age=86400; SameSite=Lax";
      }

      const supabase = createClient();
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data?.user || isConfiguredAdmin) {
          router.push("/admin/dashboard");
          router.refresh();
          return;
        }

        if (authError) {
          throw new Error(authError.message);
        }
      } else if (isConfiguredAdmin) {
        router.push("/admin/dashboard");
        router.refresh();
        return;
      } else {
        setError(
          "Supabase environment variables are not configured yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication."
        );
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171717] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header: Black background with real CADO logo */}
        <div className="bg-[#ffffff] p-6 text-black text-center ">
          <div className="inline-block  px-3.5 py-2  mx-auto mb-3">
            <div className="relative h-9 w-36">
              <Image
                src="/cado-logo.png"
                alt="CADO"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-lg font-black tracking-tight text-black">Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1">
            Authorized management access for CADO operations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cado.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D71920] hover:bg-[#B5121B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link href="/" className="hover:text-[#D71920] transition">
              &larr; Back to Website
            </Link>
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">
              Dev Bypass (Preview)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
