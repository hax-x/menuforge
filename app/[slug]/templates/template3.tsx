"use client";

import { placeOrder } from '@/queries/placeOrder';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

// Types remain the same as original
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
  // State management (same as original)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  // cart logic functions (same as original)
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

  // place order logic (same as original)
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

  // Component rendering with new styling
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: theme.fonts.body }}>
      {/* Header Component (same as original) */}
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

      {/* Hero Section with updated styling */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.fonts.heading }}>
            {tenant.name}
          </h2>
          {tenant.tagLine && (
            <p className="text-xl opacity-90">
              {tenant.tagLine}
            </p>
          )}
        </div>
      </section>

      {/* Menu Section with 3-column grid */}
      <section id="menu" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ 
            fontFamily: theme.fonts.heading,
            color: theme.colors.primary 
          }}>
            Our Menu
          </h2>
          
          {menu.map((category) => (
            <div key={category.id} className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 pb-2 border-b-2" style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary 
              }}>
                {category.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter(item => item.categoryId === category.id)
                  .map((item) => (
                    <SquareMenuItemCard 
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

      {/* About Section with 3-column grid */}
      <AboutSection tenant={tenant} theme={theme} />

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: theme.colors.accent }}>
            © {new Date().getFullYear()} {tenant.name}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Sidebar (same as original) */}
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

// Square Menu Item Card Component
function SquareMenuItemCard({ item, theme, onAddToCart, formatPrice }: {
  item: MenuItem;
  theme: any;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative aspect-square">
        <img 
          src={item.iamage_url} 
          alt={item.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {item.popular && (
          <span 
            className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white" 
            style={{ backgroundColor: theme.colors.primary }}
          >
            POPULAR
          </span>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base" style={{ color: theme.colors.text }}>
            {item.name}
          </h3>
          <span className="font-medium" style={{ color: theme.colors.primary }}>
            {formatPrice(item.price)}
          </span>
        </div>
        
        <p className="text-sm mb-4 text-gray-600">
          {item.desc}
        </p>
        
        <button 
          className="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
          style={{ backgroundColor: theme.colors.primary }}
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// Updated About Section with 3-column grid
function AboutSection({ tenant, theme }: { tenant: Tenant; theme: any }) {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ 
          fontFamily: theme.fonts.heading,
          color: theme.colors.primary 
        }}>
          About Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.secondary }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.primary }}>
              Location
            </h3>
            <p className="text-gray-600">{tenant.address}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.secondary }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.primary }}>
              Hours
            </h3>
            {tenant.hours ? (
              <p className="text-gray-600">{tenant.hours}</p>
            ) : (
              <p className="text-gray-600">Mon-Sun: 10AM - 10PM</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.secondary }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.primary }}>
              Contact
            </h3>
            <p className="text-gray-600">{tenant.phone}</p>
            <p className="text-gray-600">{tenant.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// CartSidebar and other cart components remain the same as original
// ... [rest of the cart components remain unchanged]


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