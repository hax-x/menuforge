import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import uploadToCloudinary from "@/lib/cloudinary";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();

    const itemId = formData.get("itemId") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    const file = formData.get("image") as Blob | null;
    const availability = formData.get("availability") === "true";
    const popular = formData.get("popular") === "true";

    if (!itemId || !name || !price || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    let newImageUrl = existingImageUrl;

    if (file && file.size > 0) {
      // 1. Delete previous image (optional: if you store public ID)
      const publicId = extractPublicId(existingImageUrl);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
          console.log("Previous image deleted from Cloudinary");
        } catch (error) {
          console.error("Failed to delete previous image:", error);
        }
      } else {
        console.warn("No public ID found for existing image URL. Skipping deletion.");
      }

      // 2. Upload new image
      const uploadResult = await uploadToCloudinary(file, "menu-items");
      if (!uploadResult.url) {
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }
      console.log("image uploaded");
      newImageUrl = uploadResult.url;
    }

    // 3. Update item in Supabase
    const { error } = await supabase
      .from("MenuItems")
      .update({
        name,
        price,
        desc: description,
        image_url: newImageUrl,
        updated_at: new Date(),
        availability: availability,
        popular: popular,
      })
      .eq("id", itemId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ code: 1, message: "Item updated" }, { status: 200 });

  } catch (err) {
    console.error("PUT /api/items/update error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function extractPublicId(imageUrl: string): string | null {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0]; // remove extension
    const folderIndex = parts.indexOf("menu-items");
    if (folderIndex >= 0) {
      return `menu-items/${publicId}`;
    }
    return publicId;
  } catch {
    return null;
  }
}
