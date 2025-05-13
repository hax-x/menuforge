"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "@/components/loader";

// working currently: add/delete/edit category, add/delete/edit item

// Queries
import { getCategories } from "@/queries/categories";
import { getItems } from "@/queries/items";
import { addCategory } from "@/queries/addCategory";
import { deleteItem } from "@/queries/deleteItem";
import { deleteCategory } from "@/queries/deleteCategory";
import { updateCategory } from "@/queries/editCategory";


type Item = {
  id: number;
  name: string;
  price: string;
  desc: string;
  image_url: string;
  availability: boolean;
  popular: boolean;
};

type Category = {
  id: number;
  name: string;
  items: Item[];
};

const EditMenuView = ({ tenantId }: { tenantId: string }) => {
  const [menu, setMenu] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenu = async () => {
    setLoading(true);

    const resCat = await getCategories(tenantId);
    if (resCat.code === 0) {
      console.error("Failed to fetch categories:", resCat.message);
      setLoading(false);
      return;
    }

    const categoryData = resCat.data;

    const categoriesWithItems: Category[] = await Promise.all(
      (categoryData ?? []).map(async (cat: any) => {
        const resItems = await getItems(tenantId, cat.id);
        const safeItems = resItems.code === 1 && Array.isArray(resItems.data) ? resItems.data : [];
    
        return {
          id: cat.id,
          name: cat.name,
          items: safeItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            desc: item.desc,
            image_url: item.image_url,
            availability: item.availability,
            popular: item.popular,
          })),
        };
      })
    );
  
    setMenu(categoriesWithItems);
    setLoading(false);
  };

  useEffect(() => {
    loadMenu();
  }, [tenantId]);

  const handleAddCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: "New Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Enter category name",
      showCancelButton: true,
    });

    if (categoryName) {
      const res = await addCategory(tenantId, categoryName);
      if (res.code === 0) {
        Swal.fire("Error", res.message, "error");
      } else {
        const newCategory = {
          id: res.data.id,
          name: categoryName,
          items: [],
        };
        setMenu((prev) => [...prev, newCategory]);
      }
    }
  };

  const handleAddItem = async (categoryId: number) => {
    const { value: formValues } = await Swal.fire({
      title: "Add Item",
      html: `
        <input id="name" class="swal2-input" placeholder="Name" />
        <input id="price" class="swal2-input" placeholder="Price" />
        <textarea id="desc" class="swal2-textarea" placeholder="Description"></textarea>
        <input type="file" id="image" class="swal2-file" accept="image/*" />
        <div style="margin-top: 10px;">
          <label><input type="checkbox" id="availability" /> Available</label><br/>
          <label><input type="checkbox" id="popular" /> Popular</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const popup = Swal.getPopup(); // Get the Swal popup element
        
        if (!popup) {
          throw new Error("Popup element not found");
        }
        const name = (popup.querySelector("#name") as HTMLInputElement).value;
        const price = (popup.querySelector("#price") as HTMLInputElement).value;
        const description = (popup.querySelector("#desc") as HTMLTextAreaElement).value;
        const file = (popup.querySelector("#image") as HTMLInputElement).files?.[0];
        const availability = (popup.querySelector("#availability") as HTMLInputElement).checked;
        const popular = (popup.querySelector("#popular") as HTMLInputElement).checked;
        
         // Log the values to ensure they're captured correctly
        console.log("Form Values:", { name, price, description, availability, popular });
        
        return {
          name,
          price,
          description,
          file,
          availability,
          popular,
        };
      },
    });
    
  
    if (formValues) {
      const form = new FormData();
      form.append("name", formValues.name);
      form.append("price", formValues.price);
      form.append("description", formValues.description);
      form.append("tenantId", tenantId);
      form.append("categoryId", categoryId.toString());
  
      if (formValues.file) {
        form.append("image", formValues.file);
      }
      

      // Ensure availability and popular are being sent correctly
      form.append("availability", formValues.availability ? "true" : "false");
      form.append("popular", formValues.popular ? "true" : "false");
      
      const res = await fetch("/api/items/addItem", {
        method: "POST",
        body: form,
      });
  
      const result = await res.json();
  
      if (res.ok && result.code === 1) {
        // Refresh menu
        loadMenu();

        Swal.fire("Item added!", "", "success");
      } else {
        Swal.fire("Error", result.error || "Something went wrong", "error");
      }
    }
  };

  const handleEditItem = async (item: Item) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Item",
      html: `
        <input id="name" class="swal2-input" value="${item.name}" placeholder="Name" />
        <input id="price" class="swal2-input" value="${item.price}" placeholder="Price" />
        <textarea id="desc" class="swal2-textarea" placeholder="Description">${item.desc}</textarea>
        <input type="file" id="image" class="swal2-file" accept="image/*" />
        <div style="margin-top: 10px;">
          <label><input type="checkbox" id="availability" ${item.availability ? "checked" : ""}/> Available</label><br/>
          <label><input type="checkbox" id="popular" ${item.popular ? "checked" : ""}/> Popular</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const fileInput = document.getElementById("image") as HTMLInputElement;
        const file = fileInput?.files?.[0];
  
        return {
          name: (document.getElementById("name") as HTMLInputElement).value,
          price: (document.getElementById("price") as HTMLInputElement).value,
          description: (document.getElementById("desc") as HTMLTextAreaElement).value,
          file,
          availability: (document.getElementById("availability") as HTMLInputElement).checked,
          popular: (document.getElementById("popular") as HTMLInputElement).checked,
        };
      },
    });
  
    if (formValues) {
      const form = new FormData();
      form.append("itemId", item.id.toString());
      form.append("name", formValues.name);
      form.append("price", formValues.price);
      form.append("description", formValues.description);
      form.append("existingImageUrl", item.image_url);
      form.append("availability", formValues.availability ? "true" : "false");
      form.append("popular", formValues.popular ? "true" : "false");

  
      if (formValues.file) {
        form.append("image", formValues.file);
      }
  
      const res = await fetch("/api/items/editItem", {
        method: "PUT",
        body: form,
      });
  
      const result = await res.json();
  
      if (res.ok && result.code === 1) {
        loadMenu();
        Swal.fire("Updated!", "", "success");
      } else {
        Swal.fire("Error", result.error || "Something went wrong", "error");
      }
    }
  };
  

  const handleEditCategory = async (categoryId: number, currentName: string) => {
    const { value: newName } = await Swal.fire({
      title: "Edit Category",
      input: "text",
      inputValue: currentName,
      showCancelButton: true,
      inputPlaceholder: "Enter new category name",
    });
  
    if (newName && newName !== currentName) {
      const res = await updateCategory(categoryId, newName);
      if (res.code === 1) {
        setMenu((prev) =>
          prev.map((cat) => (cat.id === categoryId ? { ...cat, name: newName } : cat))
        );
      } else {
        Swal.fire("Error", res.message, "error");
      }
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const confirm = await Swal.fire({
      title: "Delete Item?",
      text: "This will permanently delete the item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      const res = await deleteItem(itemId);
      if (res.code === 1) {
        setMenu((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          }))
        );
      } else {
        Swal.fire("Error", res.message, "error");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const confirm = await Swal.fire({
      title: "Delete Category?",
      text: "This will permanently delete the Category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      const res = await deleteCategory(categoryId);
      if (res.code === 1) {
        setMenu((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        Swal.fire("Error", res.message, "error");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="h-full overflow-y-scroll p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Edit Menu</h2>

      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {menu.map((category) => (
          <div
            key={category.id}
            className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-zinc-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-100">{category.name}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddItem(category.id)}
                  className="flex items-center gap-1 bg-violet-600 text-sm text-white px-3 py-1 rounded hover:bg-violet-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
                <button
                  onClick={() => handleEditCategory(category.id, category.name )}
                  className="flex items-center gap-1 bg-blue-600 text-sm text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="flex items-center gap-1 bg-red-600 text-sm text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="p-4">
              {category.items.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No items in this category. Click "Add Item" to get started.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <div
                    key={item.id}
                    className="bg-zinc-700 rounded-lg overflow-hidden border border-zinc-600"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-zinc-600 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-white">{item.name}</h4>
                        <span className="font-bold text-violet-300">{item.price}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{item.desc.slice(0, 20) + "..."}</p>
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEditItem(item)} className="text-blue-400 hover:text-blue-300">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditMenuView;
