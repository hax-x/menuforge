"use client"
import { createClient } from "@/supabase/client";
import { redirect } from "next/navigation";

export function SignOut () {
    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        redirect("/");
    };
    
    return (
        <div className="flex items-center justify-center h-screen">
        <button
            onClick={handleSignOut}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            Sign Out
        </button>
        </div>
    );
    }