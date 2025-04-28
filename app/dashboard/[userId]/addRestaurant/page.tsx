'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

function AddRestaurant() {
  const router = useRouter();
  const params = useParams()
  const userId = params?.userId as string
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [themeSettings, setThemeSettings] = useState({
    primary: "#000000",
    secondary: "#FFFFFF",
    accent: "#FF0000",
    background: "#FFFFFF",
    text: "#000000"
  })
  const [loading, setLoading] = useState(false)
  const [maxFileSize] = useState(5 * 1024 * 1024) // 5MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !slug || !logo) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (logo.size > maxFileSize) {
      alert("File size exceeds the maximum limit of 5MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("logo", logo);
    formData.append("themeSettings", JSON.stringify(themeSettings));
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/addRestaurant", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add restaurant");
      }

      const data = await response.json();
      console.log("Restaurant added successfully:", data);
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Error adding restaurant:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-violet-600 to-violet-800 py-6 px-6 text-center">
        <h1 className="text-3xl font-bold text-white">Add Your Restaurant</h1>
        <div className="w-12 h-1 bg-orange-300 mx-auto my-2 rounded-full"></div>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto">
          Create your restaurant profile and customize your branding
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Restaurant Details</h2>
              <p className="text-gray-400 text-sm mt-1">Fill out the form below to set up your restaurant</p>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Restaurant Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Pizza Planet"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Slug Input */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., pizza-planet"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-1">
                Logo
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  required
                  className="text-sm text-gray-400"
                />
                {logo && (
                  <div className="mt-2 p-2 bg-zinc-700 rounded-lg">
                    <p className="text-green-400 text-sm">Selected: {logo.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme Colors
              </label>
              <div className="space-y-3">
                {Object.keys(themeSettings).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <label className="capitalize w-24 text-gray-400">{key}</label>
                    <input
                      type="color"
                      value={themeSettings[key as keyof typeof themeSettings]}
                      onChange={(e) => setThemeSettings(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))}
                      className="w-12 h-10 border border-zinc-600 bg-zinc-700 rounded-lg"
                    />
                    <div 
                      className="h-10 flex-1 rounded-lg" 
                      style={{ backgroundColor: themeSettings[key as keyof typeof themeSettings] }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Restaurant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddRestaurant
