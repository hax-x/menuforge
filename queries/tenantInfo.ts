"use server"

// get current tenant infor based on slug

import { createClient } from "@/supabase/server";

export const getTenant = async (slug: any) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("Tenant")
        .select("*")
        .eq("slug", slug).single();

    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  };
  