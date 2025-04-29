"use server"

// get all tenants for a user

import { createClient } from "@/supabase/server";

export const getTenants = async (userId: any) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("Tenant")
        .select("*")
        .eq("user_id", userId);

    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  };
  