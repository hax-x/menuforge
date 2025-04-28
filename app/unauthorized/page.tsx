import React from 'react'
import Link from "next/link";
import { Button } from '@/components/ui/button';


function page() {
  return (
    <div>
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-gray-100">
            <p>Unauthorized Access</p>
            <p>Sign In to access dashboards</p>
            <Link href="/sign-in">
              <Button className="mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded">
                Sign In
              </Button>
            </Link>
        </div>
    </div>
  )
}

export default page