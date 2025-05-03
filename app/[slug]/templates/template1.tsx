"use client";

import { placeOrder } from "@/queries/placeOrder";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";

// (Keep all your existing type definitions here)
// Define proper types
type MenuItem = {
  id: number;
  name: string;
  price: number;
  desc: string;
  image_url: string;
  popular?: boolean;
  categoryId: number;
  quantity?: number;
  availability: boolean;
};

type MenuCategory = {
  id: number;
  name: string;
  items: MenuItem[];
};

type ThemeSettings = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
};

type Tenant = {
  themeSettings: ThemeSettings;
  id: number;
  slug: string;
  name: string;
  tagLine?: string;
  address: string;
  phone: string;
  email: string;
  hours?: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

interface RestaurantMenuProps {
  tenant: Tenant;
  menu: MenuCategory[];
}

export default function RestaurantMenu({ tenant, menu }: RestaurantMenuProps) {
  // (Keep all your existing state and logic here)
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  console.log(tenant.themeSettings);

  // Modern minimalist theme
  const theme = {
    colors: {
      ...tenant.themeSettings,
      background: "#f8fafc", // light slate-50
      card: "#ffffff",
      text: "#1e293b", // slate-800
      muted: "#64748b", // slate-500
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
  };

  // (Keep all your existing helper functions here)
  // memoized menu items for better performance
  const menuItems = useMemo(
    () =>
      menu.flatMap(
        (category) =>
          category.items?.map((item) => ({
            ...item,
            categoryId: category.id,
          })) || []
      ),
    [menu]
  );

  // cart logic functions
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      ),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + (item.quantity || 0), 0),
    [cart]
  );

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(price);
  };

  // place order logic
  const handlePlaceOrder = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Place Order",
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Full Name">` +
        `<input id="swal-email" type="email" class="swal2-input" placeholder="Email">` +
        `<input id="swal-phone" class="swal2-input" placeholder="Phone Number">` +
        `<textarea id="swal-address" class="swal2-textarea" placeholder="Delivery Address"></textarea>` +
        `<textarea id="swal-notes" class="swal2-textarea" placeholder="Add notes"></textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          ?.value;
        const email = (
          document.getElementById("swal-email") as HTMLInputElement
        )?.value;
        const phone = (
          document.getElementById("swal-phone") as HTMLInputElement
        )?.value;
        const address = (
          document.getElementById("swal-address") as HTMLTextAreaElement
        )?.value;

        if (!name || !email || !phone || !address) {
          Swal.showValidationMessage("Please fill out all fields");
          return;
        }

        return { name, email, phone, address };
      },
    });

    if (formValues) {
      const res = await placeOrder(
        tenant.id,
        formValues.name,
        formValues.email,
        formValues.address,
        formValues.phone,
        JSON.parse(JSON.stringify(cart)),
        formValues.notes,
        cartTotal
      );
      if (res.code === 0) {
        Swal.fire("Error", res.message, "error");
      } else {
        setShowCart(false);
        setCart([]);
        Swal.fire("Order Placed Successfully.");
      }
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Minimalist Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className="text-xl font-light tracking-tight"
            style={{ color: theme.colors.primary }}
          >
            {tenant.name}
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero with subtle gradient - now with proper spacing */}
      <section
        className="pt-16 pb-16"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.primary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-md py-8">
            {" "}
            {/* Added py-8 for internal padding */}
            <h2 className="text-4xl font-light text-white mb-3">
              {tenant.name}
            </h2>
            {tenant.tagLine && (
              <p className="text-lg text-white/90 font-light">
                {tenant.tagLine}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main content with proper spacing - removed negative margin */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {menu.map((category) => (
          <section key={category.id} className="mb-16 pt-8">
            {" "}
            {/* Added pt-8 for top padding */}
            <div className="flex items-end justify-between mb-6">
              <h3
                className="text-xl font-light"
                style={{ color: theme.colors.text }}
              >
                {category.name}
              </h3>
            </div>
            <div className="relative">
              <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
                {menuItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <MinimalMenuItemCard
                      key={item.id}
                      item={item}
                      theme={theme}
                      onAddToCart={() => addToCart(item)}
                      formatPrice={formatPrice}
                    />
                  ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: theme.colors.muted }}>
            © {new Date().getFullYear()} {tenant.name}
          </p>
        </div>
      </footer>

      {/* Minimal Cart Sidebar */}
      <MinimalCartSidebar
        showCart={showCart}
        cart={cart}
        cartTotal={cartTotal}
        theme={theme}
        formatPrice={formatPrice}
        onClose={() => setShowCart(false)}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        setCheckout={handlePlaceOrder}
      />
    </div>
  );
}

// Minimal Menu Item Card
function MinimalMenuItemCard({
  item,
  theme,
  onAddToCart,
  formatPrice,
}: {
  item: MenuItem;
  theme: any;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}) {
  return (
    <div
      className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
      style={{ backgroundColor: theme.colors.card }}
    >
      <div className="relative h-40">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {item.popular && (
          <span
            className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: theme.colors.primary,
              color: "white",
            }}
          >
            Popular
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-medium text-sm"
            style={{ color: theme.colors.text }}
          >
            {item.name}
          </h3>
          <span
            className="text-sm font-medium"
            style={{ color: theme.colors.primary }}
          >
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-xs mb-3" style={{ color: theme.colors.muted }}>
          {item.desc}
        </p>

        <button
          className="w-full py-2 text-xs font-medium rounded-md transition-colors border"
          style={{
            color: theme.colors.primary,
            borderColor: theme.colors.primary,
          }}
          onClick={onAddToCart}
        >
          Add to order
        </button>
      </div>
    </div>
  );
}

// Minimal Cart Sidebar
function MinimalCartSidebar({
  showCart,
  cart,
  cartTotal,
  theme,
  formatPrice,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  setCheckout,
}: {
  showCart: boolean;
  cart: CartItem[];
  cartTotal: number;
  theme: any;
  formatPrice: (price: number) => string;
  onClose: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  setCheckout: () => void;
}) {
  if (!showCart) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6">
                <div className="flex items-start justify-between">
                  <h2
                    className="text-lg font-light"
                    style={{ color: theme.colors.text }}
                  >
                    Your order
                  </h2>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <h3
                      className="mt-4 text-sm font-medium"
                      style={{ color: theme.colors.text }}
                    >
                      Your cart is empty
                    </h3>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
                      style={{
                        borderColor: theme.colors.primary,
                        color: theme.colors.primary,
                      }}
                      onClick={onClose}
                    >
                      Continue browsing
                    </button>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-100 mt-6">
                      {cart.map((item) => (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-100">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className="text-sm"
                                  style={{ color: theme.colors.text }}
                                >
                                  {item.name}
                                </h3>
                                <p
                                  className="text-sm ml-4"
                                  style={{ color: theme.colors.text }}
                                >
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center border rounded">
                                  <button
                                    onClick={() =>
                                      onUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="px-2 py-1 text-xs"
                                    aria-label="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span
                                    className="px-2 text-xs"
                                    style={{ color: theme.colors.text }}
                                  >
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      onUpdateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="px-2 py-1 text-xs"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="text-xs"
                                  style={{ color: theme.colors.muted }}
                                  onClick={() => onRemoveItem(item.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-100 mt-6 pt-6">
                      <div className="flex justify-between text-sm mb-4">
                        <p style={{ color: theme.colors.text }}>Subtotal</p>
                        <p style={{ color: theme.colors.text }}>
                          {formatPrice(cartTotal)}
                        </p>
                      </div>
                      <button
                        onClick={setCheckout}
                        className="w-full py-3 text-sm font-medium rounded-md text-white"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
