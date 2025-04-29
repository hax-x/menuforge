"use server"

// delete MenuItem
import { createClient } from "@/supabase/server";

export const deleteItem = async (id: any) => {
    const supabase = await createClient();

    const {error } = await supabase
      .from("MenuItems")
      .delete().eq("id", id)
    
    
        
    if (error) {
      return {"code": 0, "message": error.message} ;
    }
    return {"code": 1, "message": "success"};
  }