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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Add Restaurant</h1>

        {/* Name Input */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold text-gray-700">Restaurant Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Slug Input */}
        <div className="flex flex-col">
          <label htmlFor="slug" className="mb-2 font-semibold text-gray-700">Slug</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Logo Upload */}
        <div className="flex flex-col">
          <label htmlFor="logo" className="mb-2 font-semibold text-gray-700">Logo</label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
            className="border rounded-md p-2 bg-white"
            required
          />
          {logo && <p className="text-sm text-green-600 mt-1">Selected: {logo.name}</p>}
        </div>

        {/* Theme Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Theme Colors</h2>
          {Object.keys(themeSettings).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <label className="capitalize text-gray-700">{key}</label>
              <input
                type="color"
                value={themeSettings[key as keyof typeof themeSettings]}
                onChange={(e) => setThemeSettings(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="w-12 h-8 border-0 p-0 bg-transparent cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Restaurant"}
        </button>
      </form>
    </div>
  )
}

export default AddRestaurant
