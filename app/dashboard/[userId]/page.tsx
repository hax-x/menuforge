"use client";
import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Settings,
  Plus,
  User,
  Clock,
  Store,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

export default function UserDashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;

  const [showRecents, setShowRecents] = React.useState(true);
  const [showRestaurants, setShowRestaurants] = React.useState(true);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const restaurants = [
    { id: 1, name: "Restaurant 1", slug: "restaurant-1" },
    { id: 2, name: "Restaurant 2", slug: "restaurant-2" },
    { id: 3, name: "Restaurant 3", slug: "restaurant-3" },
    { id: 4, name: "Restaurant 4", slug: "restaurant-4" },
    { id: 5, name: "Restaurant 5", slug: "restaurant-5" },
    { id: 6, name: "Restaurant 6", slug: "restaurant-6" },
  ];

  const recents = [
    { id: 101, name: "Recent 1" },
    { id: 102, name: "Recent 2" },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  // Close profile dropdown when clicking outside
  const profileRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col text-gray-100">
      {/* Top bar */}
      <div className="flex justify-between items-center px-8 py-5 bg-zinc-800 border-b border-zinc-700 relative z-10">
        <div className="text-2xl font-bold text-violet-300">MenuForge</div>
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 transition-colors rounded-full p-2"
            aria-label="Profile menu"
          >
            <User size={24} className="text-violet-200" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-zinc-800 text-gray-100 rounded-xl shadow-lg py-2 w-48 z-50 flex flex-col gap-1 border border-zinc-700">
              <Link href="/profile" className="px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Link href="/settings" className="px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <div className="my-1 border-t border-zinc-700"></div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left hover:bg-zinc-700 text-red-400 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-800 text-gray-100 py-6 px-4 flex flex-col border-r border-zinc-700">
          <div className="mb-6">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer hover:text-violet-300 transition-colors font-medium"
              onClick={() => setShowRecents(!showRecents)}
            >
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-violet-300" />
                <span>Recents</span>
              </div>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${showRecents ? 'rotate-180' : ''}`} 
              />
            </div>
            {showRecents && (
              <div className="mb-4 pl-7 flex flex-col gap-2 text-sm text-gray-300">
                {recents.map((item) => (
                  <div 
                    key={item.id} 
                    className="cursor-pointer hover:text-violet-300 transition-colors py-1"
                  >
                    {item.name}
                  </div>
                ))}
                {recents.length === 0 && (
                  <div className="text-gray-500 text-sm italic">No recent items</div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer hover:text-violet-300 transition-colors font-medium"
              onClick={() => setShowRestaurants(!showRestaurants)}
            >
              <div className="flex items-center gap-2">
                <Store size={18} className="text-violet-300" />
                <span>Restaurants</span>
              </div>
              <ChevronDown 
                size={18}
                className={`transition-transform ${showRestaurants ? 'rotate-180' : ''}`} 
              />
            </div>
            {showRestaurants && (
              <div className="mb-4 pl-7 flex flex-col gap-2 text-sm text-gray-300">
                {restaurants.map((r) => (
                  <Link
                    key={r.id}
                    href={`/restboard/${r.slug}`}
                    className="hover:text-violet-300 transition-colors py-1"
                  >
                    {r.name}
                  </Link>
                ))}
                {restaurants.length === 0 && (
                  <div className="text-gray-500 text-sm italic">No restaurants yet</div>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            <Link href="/settings" className="block">
              <div className="px-4 py-2.5 rounded-lg bg-zinc-700 text-gray-100 text-center hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2">
                <Settings size={18} />
                <span>Settings</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-lg bg-zinc-700 text-gray-100 hover:bg-zinc-600 transition-colors w-full flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 px-8 py-8 bg-zinc-900">
          <h1 className="text-3xl font-bold mb-8 text-gray-100">Your Restaurants</h1>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {/* Add restaurant card */}
            <Link href="/add-restaurant" className="block">
              <div className="flex flex-col items-center cursor-pointer h-full">
                <div className="w-full aspect-square rounded-xl bg-zinc-800 hover:bg-zinc-700 border-2 border-dashed border-zinc-600 hover:border-violet-400 transition-all flex items-center justify-center">
                  <Plus size={56} className="text-violet-300" />
                </div>
                <div className="mt-4 text-lg font-medium text-violet-300">Add Restaurant</div>
              </div>
            </Link>

            {/* Restaurant cards */}
            {restaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restboard/${restaurant.slug}`} className="block">
                <div className="flex flex-col items-center cursor-pointer h-full group">
                  <div className="w-full aspect-square rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center overflow-hidden border border-zinc-700 group-hover:border-violet-400">
                    <div className="bg-gradient-to-br from-violet-500/20 to-purple-700/20 w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold">{restaurant.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-medium">{restaurant.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}