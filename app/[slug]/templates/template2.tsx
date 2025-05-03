"use client";

import { placeOrder } from '@/queries/placeOrder';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

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
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  console.log(tenant.themeSettings);
  

  // Theme configuration
  const theme = {
    colors: tenant.themeSettings,
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    }
  };

  // memoized menu items for better performance
  const menuItems = useMemo(() => (
    menu.flatMap(category => 
      category.items?.map(item => ({ 
        ...item, 
        categoryId: category.id 
      })) || []
  )), [menu])

  // cart logic functions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = useMemo(() => (
    cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
  ), [cart]);

  const cartItemCount = useMemo(() => (
    cart.reduce((total, item) => total + (item.quantity || 0), 0)
  ), [cart]);

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
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
        const name = (document.getElementById('swal-name') as HTMLInputElement)?.value;
        const email = (document.getElementById('swal-email') as HTMLInputElement)?.value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement)?.value;
        const address = (document.getElementById('swal-address') as HTMLTextAreaElement)?.value;
    
        if (!name || !email || !phone || !address) {
          Swal.showValidationMessage("Please fill out all fields");
          return;
        }
    
        return { name, email, phone, address };
      }
    });
  
      if (formValues) {
        const res = await placeOrder(tenant.id, formValues.name, formValues.email, formValues.address, formValues.phone, JSON.parse(JSON.stringify(cart)), formValues.notes, cartTotal);
        if (res.code === 0) {
          Swal.fire("Error", res.message, "error");
        } else {
          setShowCart(false)
          setCart([])
          Swal.fire("Order Placed Successfully.")
        }
      }
    };

  // Component rendering
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: theme.fonts.body }}>
      {/* Header Component */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-xl" style={{ 
              fontFamily: theme.fonts.heading, 
              color: theme.colors.primary 
            }}>
              {tenant.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setShowCart(true)}
              aria-label="Shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#menu" className="text-gray-700 hover:text-gray-900 hover:underline">Menu</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 hover:underline">About</a>
            </nav>
          </div>
        </div>
        
        {isMenuOpen && (
          <nav className="mt-4 pb-2 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li>
                <a 
                  href="#menu" 
                  className="block py-2 hover:bg-gray-100 rounded text-gray-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menu
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="block py-2 hover:bg-gray-100 rounded text-gray-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-10" style={{ backgroundColor: theme.colors.secondary }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ 
            fontFamily: theme.fonts.heading,
            color: theme.colors.primary 
          }}>
            {tenant.name}
          </h2>
          {tenant.tagLine && (
            <p className="text-lg" style={{ color: theme.colors.accent }}>
              {tenant.tagLine}
            </p>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ 
            fontFamily: theme.fonts.heading,
            color: theme.colors.primary 
          }}>
            Our Menu
          </h2>
          
          {menu.map((category) => (
            <div key={category.id} className="mb-10">
              <h3 className="text-xl font-medium mb-2 pb-1 border-b" style={{ 
                borderColor: theme.colors.secondary,
                color: theme.colors.primary 
              }}>
                {category.name}
              </h3>
              {/* {category.description && (
                <p className="text-sm mb-4" style={{ color: theme.colors.accent }}>
                  {category.description}
                </p>
              )} */}
              
              <div className="space-y-4">
                {menuItems
                  .filter(item => item.categoryId === category.id)
                  .map((item) => (
                    <MenuItemCard 
                      key={item.id}
                      item={item}
                      theme={theme}
                      onAddToCart={() => addToCart(item)}
                      formatPrice={formatPrice}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <AboutSection tenant={tenant} theme={theme} />

      {/* Footer */}
      <footer className="py-6 text-center border-t" style={{ borderColor: theme.colors.secondary }}>
        <p className="text-sm" style={{ color: theme.colors.accent }}>
          © {new Date().getFullYear()} {tenant.name}
        </p>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar 
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

// Extracted Components

function MenuItemCard({ item, theme, onAddToCart, formatPrice }: {
  item: MenuItem;
  theme: any;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-12 h-12 object-cover rounded-md" 
          loading="lazy"
        />
        <div>
          <div className="flex items-center">
            <h4 className="font-medium" style={{ color: theme.colors.text }}>
              {item.name}
            </h4>
            {item.popular && (
              <span 
                className="ml-2 px-2 py-0.5 text-xs font-bold rounded text-white" 
                style={{ backgroundColor: theme.colors.background }}
              >
                POPULAR
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: theme.colors.accent }}>
            {item.desc}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium mb-2" style={{ color: theme.colors.text }}>
          {formatPrice(item.price)}
        </span>
        <button 
          className="py-1 px-3 rounded text-sm border text-white"
          style={{ backgroundColor: theme.colors.primary }}
          onClick={onAddToCart}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function AboutSection({ tenant, theme }: { tenant: Tenant; theme: any }) {
  return (
    <section id="about" className="py-10" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ 
          fontFamily: theme.fonts.heading,
          color: theme.colors.primary 
        }}>
          About Us
        </h2>
        <p className="text-center mb-6" style={{ color: theme.colors.accent }}>
          Simple, fresh ingredients. Casual atmosphere. Exceptional flavors.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-2" style={{ color: theme.colors.primary }}>
              Location & Hours
            </h3>
            <p className="text-sm" style={{ color: theme.colors.accent }}>{tenant.address}</p>
            {tenant.hours && (
              <p className="text-sm" style={{ color: theme.colors.accent }}>{tenant.hours}</p>
            )}
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-2" style={{ color: theme.colors.primary }}>
              Contact
            </h3>
            <p className="text-sm" style={{ color: theme.colors.accent }}>{tenant.phone}</p>
            <p className="text-sm" style={{ color: theme.colors.accent }}>{tenant.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartSidebar({ 
  showCart, 
  cart, 
  cartTotal, 
  theme, 
  formatPrice, 
  onClose, 
  onRemoveItem, 
  onUpdateQuantity,
  setCheckout
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
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
                    Cart
                  </h2>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {cart.length === 0 ? (
                  <EmptyCart onClose={onClose} theme={theme} />
                ) : (
                  <>
                    <ul className="divide-y divide-gray-200">
                      {cart.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          theme={theme}
                          formatPrice={formatPrice}
                          onRemove={() => onRemoveItem(item.id)}
                          onUpdateQuantity={(newQty) => onUpdateQuantity(item.id, newQty)}
                        />
                      ))}
                    </ul>

                    <div className="border-t border-gray-200 mt-6 pt-6">
                      <div className="flex justify-between text-base font-medium mb-4">
                        <p style={{ color: theme.colors.text }}>Subtotal</p>
                        <p style={{ color: theme.colors.text }}>{formatPrice(cartTotal)}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCheckout();
                          console.log(cart);
                        }}
                        className="w-full py-2 px-4 border rounded-md text-white font-medium"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        Checkout
                      </button>
                      <button
                        type="button"
                        className="mt-4 w-full text-center py-2 px-4 text-gray-700 hover:text-gray-900"
                        onClick={onClose}
                      >
                        Continue Shopping
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

function CartItem({ 
  item, 
  theme, 
  formatPrice, 
  onRemove, 
  onUpdateQuantity 
}: {
  item: CartItem;
  theme: any;
  formatPrice: (price: number) => string;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <li className="py-4 flex">
      <div className="flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-center object-cover"
          loading="lazy"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium">
            <h3 style={{ color: theme.colors.text }}>{item.name}</h3>
            <p className="ml-4" style={{ color: theme.colors.text }}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center border rounded">
            <button 
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:text-gray-800"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 py-1" style={{ color: theme.colors.text }}>
              {item.quantity}
            </span>
            <button 
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:text-gray-800"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="font-medium text-red-600 hover:text-red-800"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyCart({ onClose, theme }: { onClose: () => void; theme: any }) {
  return (
    <div className="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium" style={{ color: theme.colors.text }}>
        Your cart is empty
      </h3>
      <button
        type="button"
        className="mt-4 inline-flex items-center px-4 py-2 border rounded-md text-sm text-white"
        style={{ backgroundColor: theme.colors.primary }}
        onClick={onClose}
      >
        Continue Shopping
      </button>
    </div>
  );
}