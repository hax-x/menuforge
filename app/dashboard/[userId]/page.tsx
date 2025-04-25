"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  LogOut,
  Settings,
  Plus,
  User,
  Clock,
  Store,
} from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const supabase = createClient();
  const profileRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showRecents, setShowRecents] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        router.push("/");
      } else {
        setUser(session.session.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router, supabase]);

  // Fetch user's restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("Tenant")
        .select("*")
        .eq("user_id", userId);

      if (error) console.error("Error fetching restaurants:", error.message);
      else setRestaurants(data || []);
    };

    fetchRestaurants();
  }, [userId, supabase]);

  // Handle outside click for profile menu
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const recents = [
    { id: 101, name: "Recent 1" },
    { id: 102, name: "Recent 2" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-gray-100">
        <div className="loader" />
      </div>
    );
  }

  return !user ? (
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
  ) : (
    <div className="bg-zinc-900 min-h-screen flex flex-col text-gray-100">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 py-5 bg-zinc-800 border-b border-zinc-700">
        <h1 className="text-2xl font-bold text-violet-300">MenuForge</h1>
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
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700"
              >
                <User size={16} />
                Profile
              </Link>
              <Link
                href="/settings"
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
      </header>

      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-800 border-r border-zinc-700 py-6 px-4 flex flex-col">
          {/* Recents */}
          <Section
            icon={<Clock size={18} className="text-violet-300" />}
            title="Recents"
            open={showRecents}
            toggle={() => setShowRecents(!showRecents)}
          >
            {recents.length > 0 ? (
              recents.map((r) => (
                <div
                  key={r.id}
                  className="py-1 hover:text-violet-300 cursor-pointer"
                >
                  {r.name}
                </div>
              ))
            ) : (
              <div className="text-sm italic text-gray-500">
                No recent items
              </div>
            )}
          </Section>

          {/* Restaurants */}
          <Section
            icon={<Store size={18} className="text-violet-300" />}
            title="Restaurants"
            open={showRestaurants}
            toggle={() => setShowRestaurants(!showRestaurants)}
          >
            {restaurants.length > 0 ? (
              restaurants.map((r) => (
                <Link
                  key={r.id}
                  href={`/restboard/${r.slug}`}
                  className="py-1 hover:text-violet-300 block"
                >
                  {r.name}
                </Link>
              ))
            ) : (
              <div className="text-sm italic text-gray-500">
                No restaurants yet
              </div>
            )}
          </Section>

          {/* Sidebar Footer */}
          <div className="mt-auto space-y-3">
            <Link href="/settings">
              <div className="bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2">
                <Settings size={18} />
                Settings
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 px-8 py-8">
          <h2 className="text-3xl font-bold mb-8">Your Restaurants</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            <Link href="/addRestairant">
              <div className="flex flex-col items-center h-full cursor-pointer">
                <div className="aspect-square w-full rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-800 hover:border-violet-400 hover:bg-zinc-700 transition flex items-center justify-center">
                  <Plus size={56} className="text-violet-300" />
                </div>
                <p className="mt-4 text-lg font-medium text-violet-300">
                  Add Restaurant
                </p>
              </div>
            </Link>
            {restaurants.map((r) => (
              <Link key={r.id} href={`/restboard/${r.slug}`}>
                <div className="flex flex-col items-center h-full cursor-pointer group">
                  <div className="aspect-square w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 transition" />
                  <p className="mt-4 text-lg font-medium text-gray-200 group-hover:text-violet-300">
                    {r.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Component for collapsible sections
function Section({
  icon,
  title,
  open,
  toggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div
        className="flex justify-between items-center mb-2 cursor-pointer hover:text-violet-300 font-medium"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="pl-7 flex flex-col gap-2 text-sm text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}
