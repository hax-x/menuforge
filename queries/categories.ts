"use server"

// get all menuCategories for a tenant

import { createClient } from "@/supabase/server";

export const getCategories = async (tenant_id: any) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("MenuCategory")
        .select("*")
        .eq("tenant_id", tenant_id);

    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  };
  