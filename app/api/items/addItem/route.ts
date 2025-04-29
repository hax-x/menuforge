import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import uploadToCloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const price = formData.get("price") as string | null;
    const desc = formData.get("description") as string | null;
    const image = formData.get("image") as Blob | null;
    const tenantId = formData.get("tenantId") as string | null;
    const categoryId = formData.get("categoryId") as string | null;

    if (!name || !price || !desc || !image || !tenantId || !categoryId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!(image instanceof Blob)) {
      return NextResponse.json({ error: "Invalid image file." }, { status: 400 });
    }

    const { url } = await uploadToCloudinary(image, "menu-items");
    if (!url) {
        console.log("Image upload failed:", url);        
      return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
    }

    const { data, error } = await supabase.from("MenuItems").insert([
      {
        name,
        price,
        desc,
        tenant_id: tenantId,
        category_id: categoryId,
        image_url: url,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ code: 1, message: "Item added successfully" }, { status: 201 });

  } catch (err) {
    console.error("POST /api/items/add error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
