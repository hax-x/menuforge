"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import OrdersView from "./components/OrdersView";
import EditMenuView from "./components/EditMenuView";
import StatisticsView from "./components/StatisticsView";
import Header from "@/components/header";
import { createClient } from "@/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { getUser } from "@/queries/user";
import { getTenant } from "@/queries/tenantInfo";
import { getAllOrders } from "@/queries/orders";
import { updateOrderStatus } from "@/queries/updateOrderStatus";
import Swal from "sweetalert2";



const Page = () => {
  const [activeView, setActiveView] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [orders, setOrders] = useState<any>([]);
  const params = useParams();
  const slug = params?.slug as string;

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleRestaboardData = async () => {
      const user = await getUser();

      if (user === null) {
        router.push("/sign-in"); // Not logged in
        return;
      }
      
      // if logged in, fetch this tenants data
      const tenant = await getTenant(slug);

      if (tenant.code === 0) {
        console.log("failed to fetch tenant: ", tenant.message);
        return;
      } else {
        setTenant(tenant.data);
      }

      if (user.id != tenant.data.user_id) {
        router.push("/unauthorized"); // Logged in but wrong user
        return;
      }

      // User is authorized, fetch orders for this user
      const orders = await getAllOrders(tenant.data.id);
      if (orders.code === 0) {
        console.log("failed to fetch orders: ", orders.message);
        return;
      }

      console.log("Orders: ", orders.data);     
      setOrders(orders.data);
      setLoading(false);
    }

    handleRestaboardData();
  }
  , [slug, router, supabase]);

  const [statusFilter, setStatusFilter] = useState("All");

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "No, stay logged in",
    }).then((result) => {
      if (result.isConfirmed) {
        supabase.auth.signOut();
        router.push("/sign-in");
      }
    });
  };

  const statistics = {
    totalRevenue: "$1,000",
    totalOrders: orders.length,
    averageOrderValue: "$20.00",
    popularItems: ["Burger", "Pizza"],
    peakHours: "12:00 PM - 2:00 PM",
    customerRetention: "85%",
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const result = await updateOrderStatus(orderId, status);

    if (result.code === 0) {
      console.error("Error updating order status:", result.message);
      return;
    }

    setOrders((prevOrders: any) =>
      prevOrders.map((order: any) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    console.log("Order status updated successfully:", result.data);
  };

  // if loading is true, show loader
  if (loading) {
      return (
        <Loader />
      );
    }

  return (
    <div className="bg-zinc-900 h-screen flex flex-col text-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto bg-zinc-900">
          {activeView === "orders" && (
            <OrdersView
              orders={orders}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateOrderStatus={handleUpdateStatus}
            />
          )}

          {activeView === "editMenu" && (
            <EditMenuView
              tenantId={tenant.id}
            />
          )}

          {activeView === "statistics" && (
            <StatisticsView statistics={statistics} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
