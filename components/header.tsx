import Link from "next/link"

export function Header () {
    return (
        <div className="flex overflow-hidden flex-wrap gap-5 justify-between px-20 py-7 w-full bg-zinc-800 max-md:px-5 max-md:max-w-full">
        <Link href="/">
          <div className="my-auto text-2xl font-semibold leading-none text-white cursor-pointer">
            MenuForge
          </div>
        </Link>
        <div className="flex gap-5 text-lg leading-8 text-center">
          <Link href="#contact">
            <div className="text-zinc-800">
              <div className="px-16 py-2 bg-violet-300 rounded-2xl max-md:px-5 cursor-pointer hover:bg-violet-400 transition-colors">
                Contact
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
}
      