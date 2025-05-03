"use server"

import { createClient } from "@/supabase/server";

export const placeOrder = async (
  tenant_id: any,
  name: string,
  email: string,
  address: string,
  phone: string,
  orderDetails: JSON,
  notes: string,
  totalAmount: number,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("Order").insert([
    {
      tenant_id,
      customerName: name,
      customerEmail: email,
      location: address,
      customerNumber: phone,
      orderDetails,
      created_at: new Date().toISOString(),
      notes,
      totalAmount
    },
  ]);

  if (error) {
    return { code: 0, message: error.message };
  }

  return { code: 1, data };
};
