"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import temp1 from '@/public/temp1.jpg'
import temp2 from '@/public/temp2.jpg'
import temp3 from '@/public/temp3.jpg'

const templates = [
  { id: 1, name: "Template 1", image: temp1 },
  { id: 2, name: "Template 2", image: temp2 },
  { id: 3, name: "Template 3", image: temp3 },
];

export default function RestaurantSettings({ tenant }: { tenant: any }) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    tenant.logo_url || null
  );
  const [logo, setLogo] = useState<File | null>(null);
  const [maxFileSize] = useState(5 * 1024 * 1024); // 5MB

  const [formData, setFormData] = useState({
    name: tenant.name || "",
    slug: tenant.slug || "",
    email: tenant.email || "",
    location: tenant.location || "",
    phone: tenant.phone || "",
    tagline: tenant.tagline || "",
    templateId: tenant.template_id || 1,
    themeSettings: tenant.themeSettings || {
      primary: "#000000",
      secondary: "#FFFFFF",
      accent: "#FF0000",
      background: "#FFFFFF",
      text: "#000000",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, templateId: parseInt(e.target.value) });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > maxFileSize) {
        alert("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      themeSettings: {
        ...prev.themeSettings,
        [colorKey]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("id", tenant.id);
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("slug", formData.slug);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("location", formData.location);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("tagline", formData.tagline);
    formDataToSubmit.append("templateId", formData.templateId.toString());
    formDataToSubmit.append(
      "themeSettings",
      JSON.stringify(formData.themeSettings)
    );
    if (logo) {
      formDataToSubmit.append("logo", logo);
    }

    try {
      const response = await fetch("/api/restaurants/editRestaurant", {
        method: "PUT",
        body: formDataToSubmit,
      });

      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to update restaurant settings.");
      }

      const data = await response.json();
      console.log("Updated restaurant settings:", data);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating restaurant settings:", error);
      alert("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="bg-zinc-900 min-h-screen text-gray-100">
      <div className="w-full bg-gradient-to-r from-violet-600 to-violet-800 py-6 px-6 text-center">
        <h1 className="text-3xl font-bold text-white">Restaurant Settings</h1>
        <div className="w-12 h-1 bg-orange-300 mx-auto my-2 rounded-full"></div>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto">
          Update your restaurant profile and branding
        </p>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <motion.div
          className="w-full bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">
              Restaurant Details
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Update your restaurant information and branding
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Restaurant Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Pizza Planet"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Slug Input */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Slug
              </label>
              <Input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., pizza-planet"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Contact Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., contact@pizzaplanet.com"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +1 123 456 7890"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Tagline */}
            <div>
              <label
                htmlFor="tagline"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Tagline
              </label>
              <Input
                id="tagline"
                name="tagline"
                type="text"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g., Out of this world pizza!"
                required
                className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Logo
              </label>
              <div className="flex flex-col space-y-2">
                {logoPreview && (
                  <div className="h-24 w-24 rounded-lg overflow-hidden mb-2 bg-zinc-700 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Restaurant Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="text-sm text-gray-400"
                />
                {logo && (
                  <div className="mt-2 p-2 bg-zinc-700 rounded-lg">
                    <p className="text-green-400 text-sm">
                      Selected: {logo.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label
                htmlFor="templateId"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Template
              </label>
              <div className="flex flex-col items-center gap-4">
                <select
                  id="templateId"
                  value={formData.templateId}
                  onChange={handleSelectChange}
                  className="rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-3 text-gray-100 focus:border-violet-400 focus:ring-violet-400"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>

                <div className="h-64 w-80 bg-zinc-600 rounded overflow-hidden">
                  <img
                    src={
                      (templates.find((t) => t.id === formData.templateId)
                        ?.image?.src || templates[0].image.src)
                    }
                    alt="Selected Template"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme Colors
              </label>
              <div className="space-y-3">
                {Object.keys(formData.themeSettings).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <label className="capitalize w-24 text-gray-400">
                      {key}
                    </label>
                    <input
                      type="color"
                      value={
                        formData.themeSettings[
                          key as keyof typeof formData.themeSettings
                        ]
                      }
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 border border-zinc-600 bg-zinc-700 rounded-lg"
                    />
                    <div
                      className="h-10 flex-1 rounded-lg"
                      style={{
                        backgroundColor:
                          formData.themeSettings[
                            key as keyof typeof formData.themeSettings
                          ],
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium disabled:bg-gray-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
