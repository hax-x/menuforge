"use client";
import React from 'react';
import { Filter } from "lucide-react";

type Order = {
  id: number;
  customer: string;
  items: string[];
  total: string;
  status: string;
  time: string;
};

interface OrdersViewProps {
  orders: Order[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
}

const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  statusFilter,
  setStatusFilter,
  updateOrderStatus,
}) => {
  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Orders</h2>

      {/* Filter controls */}
      <div className="mb-4 flex items-center gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <div className="flex items-center">
          <Filter size={20} className="text-violet-300 mr-2" />
          <span className="text-gray-300 mr-2">Filter by status:</span>
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === status
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 border border-zinc-700 rounded-lg">
          <thead>
            <tr className="bg-zinc-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t border-zinc-700">
                <td className="px-4 py-3 text-sm text-gray-300">#{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {order.items.join(", ")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{order.total}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Completed"
                        ? "bg-green-900 text-green-300"
                        : order.status === "In Progress"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{order.time}</td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="bg-zinc-700 border border-zinc-600 text-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersView;
