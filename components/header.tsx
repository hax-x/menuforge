import Link from "next/link"


export function Header (props: any) {
  let {mode} = props;

  
    return (
        <div className="flex overflow-hidden flex-wrap gap-5 justify-between px-20 py-7 w-full bg-zinc-800 max-md:px-5 max-md:max-w-full">
        <Link href="/">
          <div className="my-auto text-2xl font-semibold leading-none text-white cursor-pointer mt-2">
            MenuForge
          </div>
        </Link>
        <div className="flex gap-5 text-lg leading-8 text-center">
          <Link href="#contact">
            <div className="text-zinc-800">
              <div className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-violet-600 text-white items-center justify-center cursor-pointer hover:from-violet-600 hover:to-violet-700 transition-colors shadow-lg shadow-violet-500/20 w-auto inline-block px-2 py-3 rounded-xl">
                Contact
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
}
