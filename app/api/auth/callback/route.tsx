import { getUser } from "@/queries/user";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("OAuth exchange failed:", error.message);
      return NextResponse.redirect(`${requestUrl.origin}/auth-error`);
    }

    const userData = await getUser();
    if (!userData || !userData.id) {
      return NextResponse.redirect(`${requestUrl.origin}/auth-error`);
    }

    // Optional: create user_data entry if not exists
    const { data: userDataRow, error: fetchError } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (fetchError && fetchError.code === "PGRST116") {
      await supabase.from("user_data").insert({
        user_id: userData.id,
      });
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard/${userData.id}`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/`);
}