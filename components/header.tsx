"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/supabase/client";
import { User, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2"

export default function Header(props: any) {
  const { userId } = props;
  const { slug } = props;
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error fetching user:", error.message);
      else setUser(data.user);
    };

    fetchUser();
  }, [supabase]);

  console.log(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      } 
    });
  };

  // Determine which page we are on
  const isLanding = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isRestboard = pathname.startsWith("/restboard");

  let title = ['M', 'e', 'n', 'u', ' ', 'F', 'o', 'r', 'g', 'e'];
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-zinc-800 border-b border-zinc-700">
      <Link href={`/dashboard/${userId}`}>
        <h1 className="text-2xl font-bold text-violet-300 flex flex-row cursor-pointer">
          {title.map((letter, index) => (
            <motion.div
              key={index}
              initial={{ y: 0, scale: 1 }}
              whileHover={{ y: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {letter}
            </motion.div>
          ))}
        </h1>
      </Link>

      {/* Conditionally render based on route */}
      {isLanding && (
        <div className="flex gap-6 text-violet-200 text-sm">
          <Link href="#contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/login" className="hover:underline">
            Get Started
          </Link>
        </div>
      )}

      {(isDashboard || isRestboard) && (
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 rounded-full p-2"
            aria-label="Profile menu"
          >
            <User size={24} className="text-violet-200" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-zinc-800 rounded-xl border border-zinc-700 w-48 shadow-lg py-2 z-50">
              <div className="flex flex-row justify-between items-center gap-2 px-4 py-2 hover:bg-zinc-700">
                <User size={16} />
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {user?.user_metadata?.full_name || "User"}
                </p>
              </div>
              <Link
                href={`/dashboard/${userId}/settings`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700"
              >
                <Settings size={16} />
                Settings
              </Link>
              <hr className="my-1 border-zinc-700" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-zinc-700"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
