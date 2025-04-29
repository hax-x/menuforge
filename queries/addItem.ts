"use server";
import { createClient } from "@/supabase/server";

export const addItem = async (
  tenant_id: string,
  category_id: number,
  itemData: {
    name: string;
    price: string;
    description: string;
    image_url?: string;
  }
) => {
  const supabase = await createClient();

  const { error } = await supabase.from("MenuItems").insert([
    {
      name: itemData.name,
      price: itemData.price,
      description: itemData.description,
      image_url: itemData.image_url || null,
      tenant_id,
      category_id,
    },
  ]);

  if (error) return { code: 0, message: error.message };
  return { code: 1 };
};
