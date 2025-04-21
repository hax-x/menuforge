// landing page

"use client";
import { Header } from "@/components/header";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="overflow-hidden bg-zinc-800">
      {/* Navigation Bar
      <div className="flex overflow-hidden flex-wrap gap-5 justify-between px-20 py-7 w-full bg-zinc-800 max-md:px-5 max-md:max-w-full">
        <Link href="/">
          <div className="my-auto text-2xl font-semibold leading-none text-white cursor-pointer">
            MenuForge
          </div>
        </Link>
        <div className="flex gap-5 text-lg leading-8 text-center">
          <Link href="/sign-up">
            <div className="text-zinc-800">
              <div className="px-16 py-2 bg-violet-300 rounded-2xl max-md:px-5 cursor-pointer hover:bg-violet-400 transition-colors">
                Sign Up
              </div>
            </div>
          </Link>
          <Link href="/sign-in">
            <div className="text-neutral-200">
              <div className="px-16 py-2 rounded-2xl border border-violet-300 border-solid bg-violet-300 bg-opacity-0 max-md:px-5 cursor-pointer hover:bg-violet-300/10 transition-colors">
                Log in
              </div>
            </div>
          </Link>
        </div>
      </div> */}
      <Header />
      <div className="flex flex-col items-center px-0 py-16 text-center bg-neutral-800">
        <h1 className="text-6xl font-semibold leading-[90px] max-sm:text-4xl max-sm:leading-[60px]">
          Launch with Ease
        </h1>
        <p className="mt-5 text-lg leading-8 opacity-40 w-[926px] max-md:w-4/5 max-sm:text-base max-sm:w-[90%]">
          MenuForge is a powerful yet simple website builder designed
          specifically for new restaurants. Whether you're launching your first
          food venture or opening a new branch, MenuForge helps you get online
          fast with customizable templates, built-in menu tools, and seamless
          integrations for orders and reservations. No technical skills
          required—just plug in your details and go live in minutes.
        </p>
        <Link href="/sign-in">
          <div className="mt-10 w-64 text-2xl font-semibold bg-orange-300 rounded-2xl h-[57px] text-zinc-800 flex items-center justify-center cursor-pointer hover:bg-orange-400 transition-colors">
            Get Started
          </div>
        </Link>
      </div>
      <div className="flex gap-12 justify-center items-start px-0 py-12 bg-zinc-800 max-md:flex-col max-md:items-center max-sm:px-0 max-sm:py-5">
        <div className="text-center w-[311px] max-md:mb-8 max-sm:w-[90%]">
          <div className="flex justify-center">
            <Image
              src="/window.svg"
              width={70}
              height={70}
              alt="Cards icon"
              className="mb-5"
            />
          </div>
          <h2 className="text-lg font-semibold leading-8">
            Customizable Websites
          </h2>
          <p className="mt-2.5 text-lg leading-8 opacity-40">
            Customize your own website for your business according to your
            needs.
          </p>
        </div>
        <div className="text-center w-[311px] max-md:mb-8 max-sm:w-[90%]">
          <div className="flex justify-center">
            <Image
              src="/globe.svg"
              width={70}
              height={70}
              alt="Coin icon"
              className="mb-5"
            />
          </div>
          <h2 className="text-lg font-semibold leading-8">No payment fee</h2>
          <p className="mt-2.5 text-lg leading-8 opacity-40">
            Website creation is free of cost allowing you to deploy in minutes.
          </p>
        </div>
        <div className="text-center w-[311px] max-md:mb-8 max-sm:w-[90%]">
          <div className="flex justify-center">
            <Image
              src="/file.svg"
              width={70}
              height={70}
              alt="Purse icon"
              className="mb-5"
            />
          </div>
          <h2 className="text-lg font-semibold leading-8">Menu Management</h2>
          <p className="mt-2.5 text-lg leading-8 opacity-40">
            Create, update, and showcase your full menu effortlessly.
          </p>
        </div>
      </div>

      {/* contact part */}
      <div id="contact" className="px-0 py-32 pl-44 text-left bg-neutral-800 max-md:pl-12 max-sm:pl-5">
        <h2 className="text-6xl font-semibold leading-[90px] max-sm:text-4xl max-sm:leading-[60px]">
          Questions? Let's talk
        </h2>
        <p className="mt-5 text-lg leading-8 opacity-40 max-sm:text-base">
          Contact us through our 24/7 live chat. We're always happy to help!
        </p>


          <div className="mt-10 w-64 text-2xl font-semibold bg-orange-300 rounded-2xl h-[57px] text-zinc-800 flex items-center justify-center cursor-pointer hover:bg-orange-400 transition-colors">
            Contact Us
          </div>
        
      </div>
      <div className="flex justify-between items-center px-12 pt-0 pb-12 bg-zinc-800 max-md:flex-col max-md:gap-2.5 max-md:items-center max-sm:flex-col max-sm:gap-2.5 max-sm:items-center max-sm:p-5">
        <div className="text-lg font-semibold leading-8">© AHA 2025</div>
        <div className="text-lg font-semibold leading-8 cursor-pointer hover:text-violet-300">
          Privacy policy
        </div>
        <div className="text-lg font-semibold leading-8 cursor-pointer hover:text-violet-300">
          Cookies policy
        </div>
      </div>
    </div>
  );
}
