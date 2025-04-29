"use server"

// get all orders for a tenant

import { createClient } from "@/supabase/server";

export const getAllOrders = async (tenatId: any) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("Order")
        .select("*")
        .eq("tenant_id", tenatId);

    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  };
  