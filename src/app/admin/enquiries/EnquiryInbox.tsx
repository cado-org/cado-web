"use client";

import React, { useState, useTransition } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Trash2,
  Clock,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { Enquiry, EnquiryStatus } from "@/types/database";
import { updateEnquiryStatus, deleteEnquiry } from "./actions";

interface EnquiryInboxProps {
  enquiries: any[];
}

export function EnquiryInbox({ enquiries }: EnquiryInboxProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<EnquiryStatus>("new");
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = enquiries.filter((enq) => {
    const matchesStatus =
      selectedStatus === "all" ? true : enq.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      enq.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.customer_phone?.includes(searchQuery) ||
      enq.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openDetail = (enq: any) => {
    setSelectedEnquiry(enq);
    setStatusUpdate(enq.status);
    setAdminNotes(enq.admin_notes || "");
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    startTransition(async () => {
      await updateEnquiryStatus(selectedEnquiry.id, statusUpdate, adminNotes);
      setSelectedEnquiry(null);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete enquiry from "${name}"?`)) {
      startTransition(async () => {
        await deleteEnquiry(id);
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      });
    }
  };

  // CSV Export functionality
  const exportCsv = () => {
    if (filtered.length === 0) return;

    const headers = [
      "Enquiry ID",
      "Customer Name",
      "Phone",
      "Email",
      "Company",
      "Location",
      "Status",
      "Products",
      "Requirements",
      "Created At",
    ];

    const rows = filtered.map((e) => [
      e.id,
      `"${e.customer_name}"`,
      `"${e.customer_phone}"`,
      `"${e.customer_email || ""}"`,
      `"${e.company_name || ""}"`,
      `"${e.location || ""}"`,
      e.status,
      `"${(e.items || []).map((i: any) => `${i.product_name_snapshot} (${i.requested_quantity})`).join("; ")}"`,
      `"${(e.additional_requirements || "").replace(/"/g, '""')}"`,
      new Date(e.created_at).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cado-enquiries-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Enquiries Inbox</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage incoming product quote requests and WhatsApp leads.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition space-x-1.5 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {["all", "new", "contacted", "quoted", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition shrink-0 ${
                  selectedStatus === status
                    ? "bg-[#D71920] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by customer, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              No enquiries match your criteria.
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Customer enquiries submitted from the public store will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Products / Qty</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((enq) => {
                  const itemsCount = (enq.items || []).length;
                  const firstItem = (enq.items || [])[0];

                  const cleanPhone = (enq.customer_phone || "").replace(/[^0-9]/g, "");
                  const whatsappChatUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${enq.customer_name}, regarding your enquiry for CADO building products:`
                  )}`;

                  return (
                    <tr key={enq.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-gray-600">
                        #{enq.id.slice(0, 8)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">
                          {enq.customer_name}
                        </span>
                        {enq.company_name && (
                          <span className="text-[10px] text-gray-500 block">
                            {enq.company_name}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-gray-700 block">
                          {enq.customer_phone}
                        </span>
                        {enq.customer_email && (
                          <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
                            {enq.customer_email}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{enq.location}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {firstItem ? (
                          <span className="font-semibold text-gray-800 block">
                            {firstItem.product_name_snapshot} ({firstItem.requested_quantity} qty)
                            {itemsCount > 1 && (
                              <span className="text-[10px] text-gray-400 block font-normal">
                                + {itemsCount - 1} more item(s)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-400">General Enquiry</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.status === "new"
                              ? "bg-red-50 text-[#D71920]"
                              : enq.status === "contacted"
                              ? "bg-blue-50 text-blue-700"
                              : enq.status === "quoted"
                              ? "bg-purple-50 text-purple-700"
                              : enq.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`tel:${enq.customer_phone}`}
                            className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100 transition"
                            title="Call customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <a
                            href={whatsappChatUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#25D366] hover:text-[#1EBE5D] rounded hover:bg-green-50 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => openDetail(enq)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition"
                            title="View details & status"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(enq.id, enq.customer_name)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  Enquiry #{selectedEnquiry.id.slice(0, 8)}
                </h3>
                <span className="text-xs text-white/80">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Customer Card */}
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Customer Name</span>
                  <span className="font-bold text-gray-900">
                    {selectedEnquiry.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Mobile Phone</span>
                  <a
                    href={`tel:${selectedEnquiry.customer_phone}`}
                    className="font-mono font-bold text-blue-600 hover:underline"
                  >
                    {selectedEnquiry.customer_phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Email</span>
                  <span className="text-gray-700">
                    {selectedEnquiry.customer_email || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Company</span>
                  <span className="text-gray-700">
                    {selectedEnquiry.company_name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Delivery City</span>
                  <span className="font-semibold text-gray-800">
                    {selectedEnquiry.location}
                  </span>
                </div>
              </div>

              {/* Items List Snapshot */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
                  Enquired Products Snapshot
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {(selectedEnquiry.items || []).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 flex items-center justify-between bg-white"
                    >
                      <div>
                        <span className="font-bold text-gray-900 block">
                          {item.product_name_snapshot}
                        </span>
                        {item.product_sku_snapshot && (
                          <span className="text-[10px] font-mono text-gray-400">
                            Code: {item.product_sku_snapshot}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 block">
                          Qty: {item.requested_quantity}
                        </span>
                        {item.packaging_snapshot && (
                          <span className="text-[10px] text-gray-400">
                            {item.packaging_snapshot}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Requirements */}
              {selectedEnquiry.additional_requirements && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-1">
                    Customer Requirements / Notes
                  </h4>
                  <p className="text-xs text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-lg leading-relaxed">
                    {selectedEnquiry.additional_requirements}
                  </p>
                </div>
              )}

              {/* Status & Admin Notes Form */}
              <form onSubmit={handleSaveStatus} className="border-t border-gray-200 pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Update Enquiry Status
                    </label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none bg-white font-bold"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted Customer</option>
                      <option value="quoted">Quotation Provided</option>
                      <option value="completed">Completed / Dispatched</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Admin Internal Notes
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Sent formal quotation for 50 bags CADO 777..."
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${(selectedEnquiry.customer_phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${selectedEnquiry.customer_name}, regarding your CADO building materials enquiry:`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg shadow transition space-x-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-5 py-2 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                    >
                      {isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
