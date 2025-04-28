"use client";

import React, { useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import OrdersView from "./components/OrdersView";
import EditMenuView from "./components/EditMenuView";
import StatisticsView from "./components/StatisticsView";
import CategoryModal from "./components/CategoryModal";
import ItemModal from "./components/ItemModal";
import Header from "@/components/header";

const Page = () => {
  const [activeView, setActiveView] = useState("orders");
  const [profileOpen, setProfileOpen] = useState(false);

  // Refs
  const profileRef = useRef<HTMLDivElement>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customer: "John",
      items: ["Burger"],
      total: "$10",
      status: "Completed",
      time: "12:30 PM",
    },
    {
      id: 2,
      customer: "Alice",
      items: ["Pizza"],
      total: "$15",
      status: "Pending",
      time: "1:00 PM",
    },
  ]);
  const [statusFilter, setStatusFilter] = useState("All");

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleItemSubmit = (formData: ItemFormState) => {
    const newItem = {
      id: editingItem || Date.now(), // Use existing ID if editing, or generate new one
      ...formData
    };
  
    setCategories(prev => 
      prev.map(cat => 
        cat.id === currentCategoryId
          ? {
              ...cat,
              items: editingItem
                ? cat.items.map(item => item.id === editingItem ? newItem : item)
                : [...cat.items, newItem]
            }
          : cat
      )
    );
    setShowItemModal(false);
  };

  const handleCategorySubmit = (formData: CategoryFormState) => {
    const newCategory = {
      id: Date.now(), // Generate unique ID
      name: formData.name,
      items: [] // Initialize with empty array
    };
  
    setCategories([...categories, newCategory]);
    setCategoryForm({ name: "" }); // Reset form
    setShowCategoryModal(false); // Close modal
  };
  
  

  // Categories & Items
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Main",
      items: [{ id: 1, name: "Burger", price: "$10", description: "Tasty" }],
    },
  ]);

  // Modals & Forms
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState<Item>({
    name: "",
    price: "",
    description: "",
    id: 0,
  });
  const [categoryForm, setCategoryForm] = useState({ name: "" });

  // Handlers for menu editing
  const onAddItem = (categoryId: number) => {
    console.log('Add item clicked for category:', categoryId);
    setCurrentCategoryId(categoryId);
    setEditingItem(null);
    setItemForm({ id: 0, name: "", price: "", description: "" });
    setShowItemModal(true);
    console.log('showItemModal set to:', true); // Check if this is being updated
  };

  const onEditItem = (categoryId: number, item: Item) => {
    setCurrentCategoryId(categoryId);
    setEditingItem(item.id);
    setItemForm(item);
    setShowItemModal(true);
  };

  const onDeleteItem = (categoryId: number, itemId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
          : cat
      )
    );
  };

  const onDeleteCategory = (categoryId: number) => {
    const target = categories.find((cat) => cat.id === categoryId);
    if (target && target.items.length === 0) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } else {
      alert("Cannot delete a category with items.");
    }
  };

  const handleLogout = () => {
    // Redirect or clear session
    console.log("Logging out...");
  };

  const statistics: StatisticsData = {
    totalRevenue: "$1,000",
    totalOrders: orders.length,
    averageOrderValue: "$20.00",
    popularItems: ["Burger", "Pizza"],
    peakHours: "12:00 PM - 2:00 PM",
    customerRetention: "85%",
  };

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col text-gray-100">
      <Header />

      <div className="flex flex-1">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto bg-zinc-900">
          {activeView === "orders" && (
            <OrdersView
              orders={orders}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateOrderStatus={updateOrderStatus}
            />
          )}

          {activeView === "editMenu" && (
            <EditMenuView
              categories={categories}
              onAddItem={onAddItem}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onDeleteCategory={onDeleteCategory}
              onOpenCategoryModal={() => setShowCategoryModal(true)}
            />
          )}

          {activeView === "statistics" && (
            <StatisticsView statistics={statistics} />
          )}
        </main>
      </div>

      {showCategoryModal && (
        <CategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCategorySubmit}
        form={categoryForm}
        setForm={setCategoryForm}
      />
      )}

      {showItemModal && (
        <ItemModal
        show={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSubmit={handleItemSubmit}
        form={itemForm}
        setForm={setItemForm}
        isEditing={editingItem !== null}
      />
      )}
    </div>
  );
};

export default Page;
