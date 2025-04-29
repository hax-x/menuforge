"use server"

// add a new menuCategory for a tenant
import { createClient } from "@/supabase/server";

export const addCategory = async (tenant_id: any, name: string) => {
    const supabase = await createClient();
    
    const { data, error: fetchError } = await supabase
        .from("MenuCategory")
        .insert([
            { name: name, tenant_id: tenant_id }
        ])
        .select("*")
        .single();
        
    if (fetchError) {
      return {"code": 0, "message": fetchError.message} ;
    }
    return {"code": 1, data: data};
  }