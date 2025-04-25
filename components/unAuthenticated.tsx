import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

function unAuthenticated() {
  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col text-gray-100">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl text-slate-200 p-4">
          You are not authenticated to access this page
        </h1>
        <Link href={"/"}>
          <Button className="bg-violet-500 hover:bg-violet-600 text-white">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default unAuthenticated