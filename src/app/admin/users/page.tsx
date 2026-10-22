import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Users, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";

export default async function AdminUsersPage() {
  let admins: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });
      admins = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-black text-gray-900">Admin Users &amp; Roles</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Authorized administrators with access to database mutations and dashboard controls.
        </p>
      </div>

      {/* Creation / Bootstrap Guide Card */}
      <div className="bg-red-50/60 border border-red-200/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-[#D71920]">
          <KeyRound className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase tracking-wider">
            Secure Admin Creation Guide
          </h3>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          In compliance with security specifications, public admin registration is disabled. To grant administrator privileges:
        </p>
        <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1 pl-1">
          <li>Create the user account in your Supabase Dashboard under <strong>Authentication &rarr; Users</strong>.</li>
          <li>Assign the <code>admin</code> role in the <code>profiles</code> table by executing:</li>
        </ol>
        <div className="bg-[#171717] text-gray-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
          <code>
            INSERT INTO public.profiles (id, full_name, role) VALUES (&apos;USER_UUID_FROM_AUTH&apos;, &apos;Admin Name&apos;, &apos;admin&apos;);
          </code>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {admins.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No admin profiles currently registered. Connect Supabase and run the migration script.
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {adm.full_name || "Authorized Staff"}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{adm.id}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{adm.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(adm.created_at).toLocaleDateString()}
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
