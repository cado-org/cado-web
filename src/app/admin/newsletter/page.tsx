import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Mail, CheckCircle2 } from "lucide-react";

export default async function AdminNewsletterPage() {
  let subscribers: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      subscribers = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-gray-900">
          Newsletter Subscribers ({subscribers.length})
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Email leads captured via the red homepage offers strip.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No subscribers yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Subscribers will appear here when visitors enter their email on the homepage.
            </p>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">
                    {sub.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="capitalize">{sub.subscription_status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(sub.subscribed_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
