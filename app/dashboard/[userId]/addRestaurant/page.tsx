'use client'

import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion';

const templates = [
  { id: 1, name: 'Template 1', image: '/template1.png' },
  { id: 2, name: 'Template 2', image: '/template2.png' },
  { id: 3, name: 'Template 3', image: '/template3.png' },
];

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
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // for animation direction

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
    formData.append("templateId", selectedTemplate ? selectedTemplate.toString() : '1');

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

  // Variants for sliding animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  const paginate = (newDirection: number) => {
    if (selectedTemplate !== null) return; // disable changing template after selection

    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const newIndex = prev + newDirection;
      if (newIndex < 0) return templates.length - 1;
      if (newIndex >= templates.length) return 0;
      return newIndex;
    });
  };

  const selectTemplate = () => {
    setSelectedTemplate(templates[currentIndex].id);
  };

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

      {/* Template Selection or Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 my-8">
        {!selectedTemplate ? (
          <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 p-8 relative overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-100">Choose a Template</h2>
              <p className="text-gray-400 text-sm mt-1">Use arrows to browse templates and click select</p>
            </div>

            {/* Slider with spacing */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-row items-center justify-center gap-6 w-full">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous template"
                  className="p-3 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="relative w-56 h-64 flex items-center justify-center">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={templates[currentIndex].id}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="w-full h-full rounded-lg overflow-hidden border border-zinc-700 shadow-lg bg-zinc-700 flex flex-col items-center"
                      style={{ userSelect: 'none' }}
                    >
                      <img
                        src={templates[currentIndex].image}
                        alt={templates[currentIndex].name}
                        className="w-full h-48 object-cover"
                        draggable={false}
                      />
                      <div className="p-4 text-center text-gray-200 font-semibold">{templates[currentIndex].name}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => paginate(1)}
                  aria-label="Next template"
                  className="p-3 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Add spacing between image and button */}
              <button
                onClick={selectTemplate}
                className="mt-2 w-full py-3 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium"
              >
                Select This Template
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
              <Button
                type="submit"
                className="w-full py-3 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium disabled:bg-gray-500"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Create Restaurant"}
              </Button>
              <Button
                type="submit"
                className='w-full text-gray-300 hover:text-violet-300 transition-colors'
                disabled={loading}
                variant="outline"
                onClick={() => {setSelectedTemplate(null)}}
              >
                Change Template
              </Button>
              <Button className="w-full" variant="outline" disabled={loading}>
                <Link href={`/dashboard/${userId}`} className="text-gray-300 hover:text-violet-300 transition-colors">
                  Back to Dashboard
                </Link>
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AddRestaurant
