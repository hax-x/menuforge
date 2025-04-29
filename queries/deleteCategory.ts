"use server"

// delete cateogry
import { createClient } from "@/supabase/server";

export const deleteCategory = async (id: any) => {
    const supabase = await createClient();

    const {error } = await supabase
      .from("MenuCategory")
      .delete().eq("id", id);
        
    if (error) {
      return {"code": 0, "message": error.message} ;
    }
    return {"code": 1, "message": "success"};
  }