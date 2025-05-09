"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { Plus } from "lucide-react";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { getTenants } from "@/queries/tenants";
import { getUser } from "@/queries/user";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  user_id: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const supabase = createClient();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const protectRoute = async () => {
      const user = await getUser();

      if (user === null) {
        router.push("/sign-in"); // Not logged in
        return;
      }

      if (user.id !== userId) {
        router.push("/unauthorized"); // Logged in but wrong user
        return;
      }

      // Check if account was created within last 24 hours
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      if (diffInHours < 24) {
        setShowReminder(true);
      }

      // Fetch restaurants
      const tenants = await getTenants(userId);
      if (tenants.code === 0) {
        console.error("Error fetching restaurants:", tenants.message);
      } else {
        setRestaurants(tenants.data || []);
      }

      setLoading(false);
    };

    protectRoute();
  }, [userId, supabase, router]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col text-gray-100 relative">
      <Header userId={userId} />

      {/* 24-Hour Profile Reminder Popup */}
      {showReminder && (
        <div className="absolute top-4 right-4 z-50">
          <div className="relative bg-violet-600 text-white text-sm rounded-lg shadow-xl px-4 py-2 animate-bounce max-w-xs">
            👋 Welcome! Don’t forget to complete your profile and add your restaurant!
            <button
              onClick={() => setShowReminder(false)}
              className="absolute top-1 right-2 text-white hover:text-zinc-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Your Restaurants
        </h2>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {/* Add Restaurant Card */}
          <Link href={`/dashboard/${userId}/addRestaurant`} className="h-full">
            <div className="flex flex-col items-center cursor-pointer">
              <div className="aspect-square w-full rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-800 hover:border-violet-400 hover:bg-zinc-700 transition flex items-center justify-center">
                <Plus size={48} className="text-violet-300" />
              </div>
              <p className="mt-4 text-base sm:text-lg font-medium text-violet-300 text-center">
                Add Restaurant
              </p>
            </div>
          </Link>

          {/* Empty State */}
          {restaurants.length === 0 && (
            <div className="col-span-full text-center text-gray-400 italic mt-4">
              No restaurants yet. Start by adding one!
            </div>
          )}

          {/* Restaurant Cards */}
          {restaurants.map((r) => (
            <Link key={r.id} href={`/restboard/${r.slug}`} className="h-full">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="aspect-square w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 transition overflow-hidden hover:opacity-70">
                  <img
                    src={r.logo_url}
                    alt={`${r.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-base sm:text-lg font-medium text-gray-200 group-hover:text-violet-300 text-center">
                  {r.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
