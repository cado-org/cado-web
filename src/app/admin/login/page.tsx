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
      const supabase = createClient();
      if (!supabase) {
        // Fallback for initial setup before Supabase keys are entered
        setError(
          "Supabase environment variables are not configured yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication."
        );
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.user) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171717] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#D71920] p-6 text-white text-center">
          <div className="relative h-10 w-36 mx-auto mb-2">
            <Image
              src="/images/cado-logo-white.svg"
              alt="CADO"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-black tracking-tight">Admin Portal</h2>
          <p className="text-xs text-white/80 mt-1">
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
