import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import uploadToCloudinary from "@/lib/cloudinary";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;
    const logo = formData.get("logo") as Blob | null;
    const email = formData.get("email") as string | null;
    const location = formData.get("location") as string | null;
    const phone = formData.get("phone") as string | null;
    const tagline = formData.get("tagline") as string | null;
    const themeSettingsRaw = formData.get("themeSettings") as string | null;

    if (!id) {
      return NextResponse.json({ error: "Missing restaurant ID." }, { status: 400 });
    }

    const updateData: any = {};

    if (name !== null) updateData.name = name;
    if (slug !== null) updateData.slug = slug;
    if (email !== null) updateData.email = email;
    if (location !== null) updateData.location = location;
    if (phone !== null) updateData.phone = phone;
    if (tagline !== null) updateData.tagLine = tagline;
    if (themeSettingsRaw !== null) {
      try {
        updateData.themeSettings = JSON.parse(themeSettingsRaw);
      } catch {
        return NextResponse.json({ error: "Invalid themeSettings JSON." }, { status: 400 });
      }
    }

    if (logo && typeof logo === 'object' && 'size' in logo && logo.size > 0) {
      const { url } = await uploadToCloudinary(logo);
      if (!url) {
        return NextResponse.json({ error: "Failed to upload logo." }, { status: 500 });
      }
      updateData.logo_url = url;
    }

    const { data, error } = await supabase
      .from("Tenant")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error in PUT /api/editRestaurant:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
