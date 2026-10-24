"use client";

import React, { useState, useTransition } from "react";
import {
  ShoppingCart,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  X,
  Loader2,
  Download,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Order, PaymentStatus, DeliveryStatus } from "@/types/database";
import { updateOrderStatus, deleteOrder } from "./actions";

interface OrderManagerProps {
  initialOrders: Order[];
}

export function OrderManager({ initialOrders }: OrderManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal edit state
  const [modalPaymentStatus, setModalPaymentStatus] = useState<PaymentStatus>("pending");
  const [modalDeliveryStatus, setModalDeliveryStatus] = useState<DeliveryStatus>("processing");
  const [modalNotes, setModalNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if initialOrders prop changes
  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // KPI counts
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment_status === "paid").length;
  const shippedOrders = orders.filter((o) => o.delivery_status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.delivery_status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.payment_status === "pending" || o.delivery_status === "processing"
  ).length;

  // Filter & Search
  const filteredOrders = orders.filter((order) => {
    // Filter tabs
    if (statusFilter === "paid" && order.payment_status !== "paid") return false;
    if (statusFilter === "pending" && order.payment_status !== "pending") return false;
    if (statusFilter === "shipped" && order.delivery_status !== "shipped") return false;
    if (statusFilter === "delivered" && order.delivery_status !== "delivered") return false;
    if (statusFilter === "cancelled" && order.delivery_status !== "cancelled") return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesNumber = order.order_number.toLowerCase().includes(q);
    const matchesName = order.customer_name.toLowerCase().includes(q);
    const matchesPhone = order.customer_phone.includes(q);
    const matchesEmail = (order.customer_email || "").toLowerCase().includes(q);
    const matchesLocation = order.location.toLowerCase().includes(q);
    const matchesProducts = order.items.some((item) =>
      item.product_name.toLowerCase().includes(q)
    );

    return (
      matchesNumber ||
      matchesName ||
      matchesPhone ||
      matchesEmail ||
      matchesLocation ||
      matchesProducts
    );
  });

  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setModalPaymentStatus(order.payment_status);
    setModalDeliveryStatus(order.delivery_status);
    setModalNotes(order.admin_notes || "");
    setSaveSuccess(false);
  };

  // Quick inline status change
  const handleQuickStatusChange = (
    orderId: string,
    newPayment: PaymentStatus,
    newDelivery: DeliveryStatus
  ) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newPayment, newDelivery);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  payment_status: newPayment,
                  delivery_status: newDelivery,
                  updated_at: new Date().toISOString(),
                }
              : o
          )
        );
      }
    });
  };

  // Modal Save
  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    startTransition(async () => {
      const res = await updateOrderStatus(
        selectedOrder.id,
        modalPaymentStatus,
        modalDeliveryStatus,
        modalNotes
      );
      if (res.success) {
        setSaveSuccess(true);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? {
                  ...o,
                  payment_status: modalPaymentStatus,
                  delivery_status: modalDeliveryStatus,
                  admin_notes: modalNotes,
                  updated_at: new Date().toISOString(),
                }
              : o
          )
        );
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    });
  };

  const handleDelete = (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order ${orderNumber}?`)) {
      startTransition(async () => {
        await deleteOrder(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      });
    }
  };

  // Build direct customer WhatsApp URL
  const getWhatsAppUrl = (order: Order, customMessage?: string) => {
    const cleanPhone = order.customer_phone.replace(/[^0-9]/g, "");
    const productSummary = order.items
      .map((i) => `• ${i.product_name} (${i.quantity} qty${i.packaging ? ` - ${i.packaging}` : ""})`)
      .join("\n");

    const defaultMsg = `Hello ${order.customer_name},\n\nThis is CADO Building Products regarding your Order *${order.order_number}*.\n\n*Ordered Items:*\n${productSummary}\n\n*Delivery Location:* ${order.location}\n*Payment Status:* ${order.payment_status.toUpperCase()}\n*Delivery Status:* ${order.delivery_status.toUpperCase()}\n\nPlease let us know if you need any assistance with your order!`;

    const finalMsg = customMessage || defaultMsg;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMsg)}`;
  };

  // CSV Export
  const exportCsv = () => {
    if (filteredOrders.length === 0) return;
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Company",
      "Location",
      "Payment Status",
      "Delivery Status",
      "Total Items",
      "Products Breakdown",
      "Notes",
    ];

    const rows = filteredOrders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString(),
      `"${o.customer_name}"`,
      `"${o.customer_phone}"`,
      `"${o.customer_email || ""}"`,
      `"${o.company_name || ""}"`,
      `"${o.location}"`,
      o.payment_status.toUpperCase(),
      o.delivery_status.toUpperCase(),
      o.total_quantity,
      `"${o.items.map((i) => `${i.product_name} (${i.quantity})`).join("; ")}"`,
      `"${(o.admin_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cado-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Orders Management</h2>
            <span className="bg-[#D71920]/10 text-[#D71920] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalOrders} Orders
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track customer purchases, products ordered, contact on WhatsApp, and update paid, shipped &amp; delivered statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          disabled={filteredOrders.length === 0}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Total Orders
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{totalOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Paid Orders
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{paidOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Shipped / In Transit
            </span>
            <div className="text-2xl font-black text-purple-700 mt-0.5">{shippedOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Delivered Orders
            </span>
            <div className="text-2xl font-black text-blue-700 mt-0.5">{deliveredOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by order #, customer, phone, email, product, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#D71920]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center overflow-x-auto space-x-1 text-xs">
          {[
            { id: "all", label: `All (${orders.length})` },
            { id: "paid", label: `Paid (${paidOrders})` },
            { id: "pending", label: `Pending (${pendingOrders})` },
            { id: "shipped", label: `Shipped (${shippedOrders})` },
            { id: "delivered", label: `Delivered (${deliveredOrders})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#D71920] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No orders found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "No orders match your filter criteria. Try resetting your search."
                : "Customer orders from the website cart and enquiry list will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Products &amp; Quantities</th>
                  <th className="py-3.5 px-3">Payment</th>
                  <th className="py-3.5 px-3">Delivery Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const whatsappUrl = getWhatsAppUrl(order);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* 1. Order Info */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-gray-900 block">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(order.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* 2. Customer Details */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-gray-900">{order.customer_name}</div>
                        <div className="flex items-center space-x-1 text-gray-600 mt-1">
                          <Phone className="w-3 h-3 text-[#D71920] shrink-0" />
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="hover:underline font-mono text-[11px]"
                          >
                            {order.customer_phone}
                          </a>
                        </div>
                        {order.customer_email ? (
                          <div className="flex items-center space-x-1 text-gray-600 mt-0.5">
                            <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                            <a
                              href={`mailto:${order.customer_email}`}
                              className="hover:underline text-[11px] truncate max-w-[170px]"
                            >
                              {order.customer_email}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic mt-0.5 block">
                            No email provided
                          </span>
                        )}
                        <div className="flex items-center space-x-1 text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-[11px] truncate max-w-[170px]">
                            {order.location}
                          </span>
                        </div>
                      </td>

                      {/* 3. Products & How much number */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-2 bg-gray-50 px-2 py-1.5 rounded border border-gray-100"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-gray-900 line-clamp-1 block text-[11px]">
                                  {item.product_name}
                                </span>
                                {item.packaging && (
                                  <span className="text-[10px] text-gray-500 block">
                                    {item.packaging}
                                  </span>
                                )}
                              </div>
                              <span className="bg-[#D71920] text-white text-[11px] font-black px-1.5 py-0.5 rounded shrink-0">
                                {item.quantity} qty
                              </span>
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold mt-1.5 block">
                          Total: {order.total_quantity} items
                        </span>
                      </td>

                      {/* 4. Payment Status Interactive Selector */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={order.payment_status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              order.id,
                              e.target.value as PaymentStatus,
                              order.delivery_status
                            )
                          }
                          className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                            order.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : order.payment_status === "cod"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : order.payment_status === "failed"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="paid">🟢 Paid</option>
                          <option value="cod">🔵 COD</option>
                          <option value="failed">🔴 Failed</option>
                        </select>
                      </td>

                      {/* 5. Delivery Status Interactive Selector */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={order.delivery_status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              order.id,
                              order.payment_status,
                              e.target.value as DeliveryStatus
                            )
                          }
                          className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                            order.delivery_status === "delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : order.delivery_status === "shipped"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : order.delivery_status === "cancelled"
                              ? "bg-gray-100 text-gray-700 border-gray-300"
                              : "bg-blue-50 text-blue-800 border-blue-300"
                          }`}
                        >
                          <option value="processing">🔵 Processing</option>
                          <option value="shipped">🟣 Shipped</option>
                          <option value="delivered">🟢 Delivered</option>
                          <option value="cancelled">⚪ Cancelled</option>
                        </select>
                      </td>

                      {/* 6. Actions: WhatsApp + View + Delete */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Direct WhatsApp Contact Button */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded font-bold text-xs shadow-xs transition"
                            title="Contact customer on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* View Order Detail Button */}
                          <button
                            type="button"
                            onClick={() => openViewModal(order)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
                            title="View full order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(order.id, order.order_number)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete order"
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

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="bg-[#D71920] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h3 className="font-bold text-base">
                    Order Details: {selectedOrder.order_number}
                  </h3>
                </div>
                <p className="text-white/80 text-xs mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-white/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Order status &amp; notes updated successfully!</span>
                </div>
              )}

              {/* Customer Info Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Customer Information
                  </h4>

                  {/* WhatsApp Quick Action inside Modal */}
                  <a
                    href={getWhatsAppUrl(selectedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-md text-xs font-bold shadow-xs transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Full Name</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {selectedOrder.customer_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[11px]">Phone Number</span>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${selectedOrder.customer_phone}`}
                        className="font-mono font-bold text-[#D71920] hover:underline"
                      >
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[11px]">Email Address</span>
                    {selectedOrder.customer_email ? (
                      <a
                        href={`mailto:${selectedOrder.customer_email}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {selectedOrder.customer_email}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[11px]">Delivery Location</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.location}
                    </span>
                  </div>

                  {selectedOrder.company_name && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 block text-[11px]">Company Name</span>
                      <span className="font-semibold text-gray-800">
                        {selectedOrder.company_name}
                      </span>
                    </div>
                  )}

                  {selectedOrder.additional_requirements && (
                    <div className="sm:col-span-2 pt-1 border-t border-gray-200">
                      <span className="text-gray-500 block text-[11px]">
                        Customer Notes / Requirements
                      </span>
                      <p className="text-gray-700 italic mt-0.5">
                        &ldquo;{selectedOrder.additional_requirements}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Ordered Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3">
                  Products Ordered ({selectedOrder.total_quantity} Total Items)
                </h4>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">Packaging / SKU</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-bold text-gray-900">
                            {item.product_name}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500">
                            {item.packaging || item.product_sku || "Standard"}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 bg-[#D71920] text-white font-black rounded text-xs">
                              {item.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Status & Notes Edit Form */}
              <form onSubmit={handleModalSave} className="space-y-4 border-t border-gray-200 pt-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                  Manage Order Status &amp; Admin Notes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Payment Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Payment Status
                    </label>
                    <select
                      value={modalPaymentStatus}
                      onChange={(e) => setModalPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
                    >
                      <option value="pending">🟡 Pending Payment</option>
                      <option value="paid">🟢 Paid (Payment Received)</option>
                      <option value="cod">🔵 Cash on Delivery</option>
                      <option value="failed">🔴 Failed / Cancelled</option>
                    </select>
                  </div>

                  {/* Delivery Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Delivery / Fulfillment Status
                    </label>
                    <select
                      value={modalDeliveryStatus}
                      onChange={(e) => setModalDeliveryStatus(e.target.value as DeliveryStatus)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
                    >
                      <option value="processing">🔵 Processing (Packing order)</option>
                      <option value="shipped">🟣 Shipped (On the way)</option>
                      <option value="delivered">🟢 Delivered (Completed)</option>
                      <option value="cancelled">⚪ Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Internal Notes / Tracking Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Admin Notes / Courier Tracking Info
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Dispatched via VRL Logistics, Tracking #729183. Paid via UPI."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:border-[#D71920] focus:outline-none"
                  />
                </div>

                {/* Pre-formatted WhatsApp Status Message Triggers */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Quick WhatsApp Status Notifications
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={getWhatsAppUrl(
                        selectedOrder,
                        `Hello ${selectedOrder.customer_name},\n\nWe have received your payment for order *${selectedOrder.order_number}*. Thank you! Your items are now being prepared for dispatch.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-semibold flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Send &ldquo;Payment Received&rdquo;</span>
                    </a>

                    <a
                      href={getWhatsAppUrl(
                        selectedOrder,
                        `Hello ${selectedOrder.customer_name},\n\nGood news! Your order *${selectedOrder.order_number}* has been *Shipped* and is on the way to ${selectedOrder.location}.\n${modalNotes ? `Details: ${modalNotes}\n` : ""}We will notify you upon delivery.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded text-xs font-semibold flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Send &ldquo;Order Shipped&rdquo;</span>
                    </a>

                    <a
                      href={getWhatsAppUrl(
                        selectedOrder,
                        `Hello ${selectedOrder.customer_name},\n\nYour order *${selectedOrder.order_number}* has been successfully *Delivered* to ${selectedOrder.location}. Thank you for choosing CADO Building Products!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded text-xs font-semibold flex items-center space-x-1"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      <span>Send &ldquo;Delivered&rdquo;</span>
                    </a>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2 bg-[#D71920] hover:bg-[#B5121B] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow transition disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Status &amp; Notes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
