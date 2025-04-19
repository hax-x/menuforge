"use client" 

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/components/signout";

export default function Home() {
  // redirect("/sign-in");
  return <>
    <h1>Landing Page</h1>
    
    <Button variant="default" onClick={() => redirect("/sign-in")}>
      Get Started    
    </Button>

    <SignOut />
  </>;    
}
