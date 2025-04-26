import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import uploadToCloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;
    const logo = formData.get("logo") as Blob | null;
    const themeSettingsRaw = formData.get("themeSettings") as string | null;
    const userId = formData.get("userId") as string | null;
    const id = uuidv4();

    if (!name || !slug || !logo || !themeSettingsRaw || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!(logo instanceof Blob)) {
      return NextResponse.json({ error: "Invalid logo file." }, { status: 400 });
    }

    const themeSettings = JSON.parse(themeSettingsRaw);

    // cloudinary upload
    const { url } = await uploadToCloudinary(logo);
    if (!url) {
      return NextResponse.json({ error: "Failed to upload logo." }, { status: 500 });
    }

    // insert restaurant data into Supabase
    const { data, error } = await supabase
      .from("Tenant")
      .insert([
        {
          id, 
          name,
          slug,
          logo_url: url,
          themeSettings: themeSettings,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/addRestaurant:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
