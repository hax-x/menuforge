"use server";

import { createClient } from "@/supabase/server";

export const updateOrderStatus = async (orderId: string, status: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Order")
    .update({ status, updated_at: new Date() })
    .eq("id", orderId)
    .select();

  if (error) {
    return {
      code: 0,
      message: error.message || "Unknown error occurred while updating order status.",
    };
  }

  if (!data || data.length === 0) {
    return {
      code: 0,
      message: "No matching order found to update.",
    };
  }

  return {
    code: 1,
    message: "Order status updated successfully",
    data: data[0],
  };
};
