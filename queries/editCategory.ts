"use server";
import { createClient } from "@/supabase/server";

export const updateCategory = async (categoryId: number, newName: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("MenuCategory")
    .update({ name: newName, updated_at: new Date() })
    .eq("id", categoryId);

  if (error) return { code: 0, message: error.message };
  return { code: 1 };
};
