"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="overflow-hidden bg-zinc-900 text-gray-100 min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="flex flex-col items-center px-6 py-24 text-center bg-gradient-to-b from-zinc-800 to-zinc-900">
        <h1 className="text-6xl font-bold leading-tight max-sm:text-4xl max-sm:leading-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-orange-300">
          Launch with Ease
        </h1>
        <p className="mt-8 text-xl leading-relaxed text-gray-300 max-w-4xl mx-auto max-md:w-4/5 max-sm:text-base max-sm:w-full">
          MenuForge is a powerful yet simple website builder designed
          specifically for new restaurants. Whether you're launching your first
          food venture or opening a new branch, MenuForge helps you get online
          fast with customizable templates, built-in menu tools, and seamless
          integrations for orders and reservations. No technical skills
          required—just plug in your details and go live in minutes.
        </p>
        <Link href="/sign-in">
          <div className="mt-12 w-64 text-xl font-semibold bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg px-6 py-4 text-zinc-900 flex items-center justify-center cursor-pointer hover:from-orange-500 hover:to-orange-600 transition-colors shadow-lg shadow-orange-400/20">
            Get Started
          </div>
        </Link>
      </section>
      
      {/* Features Section */}
      <section className="flex gap-12 justify-center items-start px-8 py-24 bg-zinc-900 max-md:flex-col max-md:items-center max-sm:px-6 max-sm:py-16">
        <div className="text-center w-[320px] max-md:mb-12 max-sm:w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-violet-500/10 p-5 border border-violet-400/20">
              <Image
                src="/window.svg"
                width={60}
                height={60}
                alt="Customizable websites icon"
                className="opacity-90"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3 text-violet-300">
            Customizable Websites
          </h2>
          <p className="text-lg leading-relaxed text-gray-400">
            Customize your own website for your business according to your
            needs with our intuitive drag-and-drop builder.
          </p>
        </div>
        
        <div className="text-center w-[320px] max-md:mb-12 max-sm:w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-orange-500/10 p-5 border border-orange-400/20">
              <Image
                src="/globe.svg"
                width={60}
                height={60}
                alt="Free service icon"
                className="opacity-90"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3 text-orange-300">
            No Payment Fee
          </h2>
          <p className="text-lg leading-relaxed text-gray-400">
            Website creation is free of cost allowing you to deploy in minutes
            without any hidden charges.
          </p>
        </div>
        
        <div className="text-center w-[320px] max-md:mb-8 max-sm:w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-violet-500/10 p-5 border border-violet-400/20">
              <Image
                src="/file.svg"
                width={60}
                height={60}
                alt="Menu management icon"
                className="opacity-90"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3 text-violet-300">
            Menu Management
          </h2>
          <p className="text-lg leading-relaxed text-gray-400">
            Create, update, and showcase your full menu effortlessly with our
            specialized restaurant tools.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-8 py-24 bg-gradient-to-b from-zinc-900 to-zinc-800 max-md:px-8 max-sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold leading-tight max-sm:text-4xl max-sm:leading-tight">
            Questions? <span className="text-orange-300">Let's talk</span>
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-gray-300 max-w-2xl max-sm:text-base">
            Contact us through our 24/7 live chat. Our support team is always ready to help you create the perfect restaurant website!
          </p>
          <button className="mt-12 text-xl font-semibold bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg px-8 py-4 text-white flex items-center justify-center cursor-pointer hover:from-violet-600 hover:to-violet-700 transition-colors shadow-lg shadow-violet-500/20 w-auto">
            Contact Us
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto px-8 py-8 bg-zinc-800 border-t border-zinc-700">
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-4 max-sm:gap-6">
          <div className="text-lg font-medium text-gray-300">© MenuForge 2025</div>
          <div className="flex gap-8 max-sm:flex-col max-sm:gap-4 max-sm:items-center">
            <Link href="/privacy" className="text-gray-300 hover:text-violet-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-300 hover:text-violet-300 transition-colors">
              Cookies Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-violet-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}