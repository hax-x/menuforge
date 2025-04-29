"use server"

// get all menuItems for a tenant and category

import { createClient } from "@/supabase/server";

export const getItems = async (tenant_id: any, category_id: number) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("MenuItems")
        .select("*")
        .eq("tenant_id", tenant_id)
        .eq("category_id", category_id);

    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  };
  