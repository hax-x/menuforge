"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Link from "next/link";

export default function UserSettings() {
  const supabase = createClient();
  const params = useParams();
  const userId = params?.userId as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("User")
        .select("first_name, last_name, email, phone_number")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else if (data) {
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
      }
    };

    fetchUserData();
  }, [userId, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("User")
      .update(formData)
      .eq("id", userId);

    setLoading(false);

    if (error) {
      alert("Failed to update profile.");
      console.error(error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-gray-100">
      <Header userId={userId} />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Account Settings</h2>
          <Link href={`/dashboard/${userId}`}>
            <Button className="bg-slate-500 hover:bg-slate-700 rounded-md">
              Go Back
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex bg-violet-600 hover:bg-violet-500 justify-center text-white rounded-md px-4 py-2 mt-4"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
