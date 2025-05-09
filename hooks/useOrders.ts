// hooks/useOrders.ts
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

export function useRealtimeOrders(tenantId: string) {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("Order")
        .select("*")
        .eq("tenant_id", tenantId);

      if (!error && data) setOrders(data);
    };

    fetchInitial();

    const channel = supabase
      .channel(`orders:tenant=${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // or 'INSERT' | 'UPDATE' | 'DELETE'
          schema: "public",
          table: "Order",
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          console.log("Realtime payload:", payload);

          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((order) => order.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, supabase]);

  return orders;
}
