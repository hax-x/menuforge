"use client";
import React from 'react';
import { Filter } from "lucide-react";

//Made changes to the grid and fixed the filters

// type Order = {
//   id: string;
//   customerName: string;
//   items: string;
//   totalAmount: string;
//   status: string;
//   time: string;
// };

interface OrdersViewProps {
  orders: Order[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  statusFilter,
  setStatusFilter,
  updateOrderStatus,
}) => {
  // Exclude completed orders from active view
  const activeOrders = orders.filter(order => order.status !== "Completed" && order.created_at.toString().slice(0, 10) === new Date().toISOString().slice(0, 10));
    


  const filteredOrders =
    statusFilter === "All"
      ? activeOrders
      : activeOrders.filter((order) => order.status === statusFilter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Orders</h2>

      {/* Added filter changes */}
      {/* Filter controls */}
      <div className="mb-4 flex items-center gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <div className="flex items-center">
          <Filter size={20} className="text-violet-300 mr-2" />
          <span className="text-gray-300 mr-2">Filter by status:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending Confirmation", "Confirmed", "In Progress", "Dispatched", "Delivered"].map((status) => (
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
      {/* Fixed grid size inconsistencies */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 border border-zinc-700 rounded-lg table-fixed">
          <thead>
            <tr className="bg-zinc-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-8">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-40">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-60">Items</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-24">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-36">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-36">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-100 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-zinc-700">
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">{order.items}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">{order.totalAmount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                        order.status === "Delivered"
                          ? "bg-green-900 text-green-300"
                          : order.status === "Dispatched"
                          ? "bg-blue-900 text-blue-300"
                          : order.status === "In Progress"
                          ? "bg-yellow-900 text-yellow-300"
                          : order.status === "Confirmed"
                          ? "bg-indigo-900 text-indigo-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">{order.created_at.toString().slice(11, 16)}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="bg-zinc-700 border border-zinc-600 text-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-violet-400 w-full"
                    >
                      <option value="Pending Confirmation">Pending Confirmation</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option> 
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersView;
