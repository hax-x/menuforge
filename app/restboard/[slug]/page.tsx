"use client";

import React, { useEffect, useState } from "react";
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
import { updateOrderStatus } from "@/queries/updateOrderStatus";
import Swal from "sweetalert2";
import { useRealtimeOrders } from "@/hooks/useOrders";

const Page = () => {
  const [activeView, setActiveView] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [orders, setOrders] = useState<any>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const params = useParams();
  const slug = params?.slug as string;
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleRestaboardData = async () => {
      const user = await getUser();

      if (user === null) {
        router.push("/sign-in");
        return;
      }

      const tenant = await getTenant(slug);

      if (tenant.code === 0) {
        console.log("failed to fetch tenant: ", tenant.message);
        return;
      } else {
        setTenant(tenant.data);
      }

      if (user.id != tenant.data.user_id) {
        router.push("/unauthorized");
        return;
      }

      setLoading(false);
    };

    handleRestaboardData();
  }, [slug, router, supabase]);

  // Use realtime orders only after tenant is loaded
  const realtimeOrders = useRealtimeOrders(tenant?.id);

  useEffect(() => {
    if (realtimeOrders && Array.isArray(realtimeOrders)) {
      setOrders(realtimeOrders);
    }
  }, [realtimeOrders]);

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

  if (loading || !tenant) {
    return <Loader />;
  }

  return (
    <div className="bg-zinc-900 h-screen flex flex-col text-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          slug={slug}
          tenatId={tenant.id}
          userId={tenant.user_id}
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
            <EditMenuView tenantId={tenant.id} />
          )}

          {activeView === "statistics" && (
            <StatisticsView orders={orders} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
