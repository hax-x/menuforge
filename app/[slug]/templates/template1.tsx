"use client";

import React, { useState, useEffect } from 'react';

type Item = {
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

type Category = {
  id: number;
  name: string;
  items: Item[];
};

interface Props {
  tenant: any
  menu: Category[];
}

export default function TemplateOne({tenant, menu}: Props) {
  // Restaurant data from props
  const restaurantData = tenant;
  
  // Menu data from props
  const categories = menu;
  
  // Flatten menu items for easier access
  const menuItems = menu.flatMap(category => 
    category.items?.map(item => ({...item, categoryId: category.id})) || []
  );

  const theme = {
    colors: {
      primary: "#1D3557",
      secondary: "#A8DADC",
      accent: "#F1FAEE",
      highlight: "#E63946",
      text: "#2A2A2A",
      lightText: "#6C757D"
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Raleway', sans-serif"
    }
  };

  // State for mobile menu and special modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [cart, setCart] = useState<Item[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });

  // Add item to cart
  const addToCart = (item: Item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Update item quantity
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

  // Calculate total
  const cartTotal = cart.reduce((total, item) => 
    total + (item.price * (item.quantity || 1)), 0);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle order submission
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Order submitted:', { customerDetails, cart, total: cartTotal });
    setOrderCompleted(true);
    setCart([]);
  };

  // Format price
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundColor: theme.colors.accent,
      fontFamily: theme.fonts.body
    }}>
      {/* Header */}
      <header className="p-4 shadow-md" style={{ 
        backgroundColor: theme.colors.primary, 
        color: theme.colors.accent 
      }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={restaurantData.logo} alt={`${restaurantData.name} Logo`} className="h-16 mr-4" />
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{restaurantData.name}</h1>
              <p className="text-sm">{restaurantData.tagline}</p>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden bg-transparent border border-white rounded px-3 py-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 'Close Menu' : 'Menu'}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li><a href="#menu" className="hover:text-white transition duration-300">Menu</a></li>
              <li><a href="#about" className="hover:text-white transition duration-300">About</a></li>
            </ul>
            <button 
              className="ml-6 relative p-2"
              onClick={() => setShowCart(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li><a href="#menu" className="block px-2 py-1 hover:bg-opacity-20 hover:bg-white rounded transition duration-300">Menu</a></li>
              <li><a href="#about" className="block px-2 py-1 hover:bg-opacity-20 hover:bg-white rounded transition duration-300">About</a></li>
              <li>
                <button 
                  className="w-full text-left px-2 py-1 bg-white text-primary rounded hover:bg-gray-200 transition duration-300"
                  onClick={() => {
                    setShowSpecialModal(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Today's Special
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-2 py-1 flex items-center bg-white text-primary rounded hover:bg-gray-200 transition duration-300"
                  onClick={() => {
                    setShowCart(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart ({cart.reduce((total, item) => total + (item.quantity || 1), 0)})
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Hero banner */}
      <section className="relative py-16 md:py-24" style={{ backgroundColor: theme.colors.primary }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ 
            color: theme.colors.accent,
            fontFamily: theme.fonts.heading
          }}>
            Experience Culinary Excellence
          </h2>
          <p className="text-lg md:text-xl" style={{ color: theme.colors.secondary }}>
            Discover our chef's selection of gourmet dishes
          </p>
        </div>
      </section>

      {/* Menu section */}
      <section id="menu" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ 
            color: theme.colors.primary,
            fontFamily: theme.fonts.heading
          }}>
            Our Menu
          </h2>
          
          {/* Display all categories with their items */}
          {categories.map((category) => (
            <div key={category.id} className="mb-12">
              <h3 className="text-2xl font-bold mb-3 pb-2 border-b-2" style={{ 
                color: theme.colors.primary,
                borderColor: theme.colors.secondary,
                fontFamily: theme.fonts.heading
              }}>
                {category.name}
              </h3>
              <p className="text-lg italic mb-6" style={{ color: theme.colors.lightText }}>
                {/* {category.description} */}
              </p>
              
              {/* Menu items grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter(item => item.categoryId === category.id)
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                      style={{ backgroundColor: theme.colors.secondary }}
                    >
                      <div className="relative flex-grow-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
                        {item.popular && (
                          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded" style={{ 
                            backgroundColor: theme.colors.highlight,
                            color: 'white'
                          }}>
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold" style={{ 
                            color: theme.colors.primary,
                            fontFamily: theme.fonts.heading
                          }}>
                            {item.name}
                          </h3>
                          <span className="font-medium text-lg" style={{ color: theme.colors.primary }}>
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <p className="text-sm mb-4 flex-grow" style={{ color: theme.colors.text }}>
                          {item.desc}
                        </p>
                        <button 
                          className="mt-auto py-2 rounded font-medium transition duration-300 hover:opacity-90"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.accent
                          }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-12 md:py-16" style={{ backgroundColor: theme.colors.primary }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ 
              color: theme.colors.accent,
              fontFamily: theme.fonts.heading
            }}>
              About {restaurantData.name}
            </h2>
            <p className="text-lg mb-8" style={{ color: theme.colors.secondary }}>
              At {restaurantData.name}, we believe in creating unforgettable dining experiences. 
              Our chefs source only the finest ingredients, preparing each dish with passion and precision.
              From our attentive service to our carefully curated wine list, every detail is designed 
              to make your visit special.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.primary }}>Location</h3>
                <p>{restaurantData.location}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.primary }}>Hours</h3>
                <p>{restaurantData.hours}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.primary }}>Reservations</h3>
                <p>{restaurantData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ 
        backgroundColor: theme.colors.primary,
        color: theme.colors.accent
      }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src={restaurantData.logo_url} alt={`${restaurantData.name} Logo`} className="h-12 mb-2" />
              <p className="text-sm">{restaurantData.tagLine}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="mb-2">{restaurantData.location}</p>
              <p>{restaurantData.phone}</p>
              <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} {restaurantData.name}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Special offer modal */}
      {showSpecialModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowSpecialModal(false)}
            >
              ✕
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4" style={{ 
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading
              }}>
                Today's Special
              </h3>
              <img src="/api/placeholder/300/200" alt="Today's Special" className="mx-auto mb-4 rounded" />
              <h4 className="text-xl font-semibold mb-2" style={{ color: theme.colors.primary }}>
                Chef's Tasting Menu
              </h4>
              <p className="mb-4" style={{ color: theme.colors.text }}>
                Four-course meal curated by our executive chef, featuring seasonal ingredients and wine pairings.
              </p>
              <p className="text-2xl font-bold mb-6" style={{ color: theme.colors.highlight }}>
                $59.99 per person
              </p>
              <button 
                className="w-full py-3 rounded-lg font-medium transition duration-300 hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.accent
                }}
                onClick={() => setShowSpecialModal(false)}
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowCart(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium" style={{ color: theme.colors.primary }}>
                        Shopping cart
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowCart(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium" style={{ color: theme.colors.primary }}>Your cart is empty</h3>
                            <p className="mt-1 text-gray-500">Start adding some delicious items to your cart!</p>
                            <div className="mt-6">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                                style={{ backgroundColor: theme.colors.primary }}
                                onClick={() => setShowCart(false)}
                              >
                                Continue Shopping
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cart.map((item) => (
                                <li key={item.id} className="py-6 flex">
                                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="w-full h-full object-center object-cover"
                                    />
                                  </div>

                                  <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium" style={{ color: theme.colors.primary }}>
                                        <h3>{item.name}</h3>
                                        <p className="ml-4">{formatPrice(item.price * (item.quantity || 1))}</p>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button 
                                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                          className="px-2 py-1 border rounded-l"
                                        >
                                          -
                                        </button>
                                        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                                        <button 
                                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                          className="px-2 py-1 border rounded-r"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium"
                                          style={{ color: theme.colors.highlight }}
                                          onClick={() => removeFromCart(item.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium mb-4" style={{ color: theme.colors.primary }}>
                        <p>Subtotal</p>
                        <p>{formatPrice(cartTotal)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500 mb-6">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <button
                        onClick={() => setOrderCompleted(false)}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        Checkout
                      </button>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium"
                            style={{ color: theme.colors.primary }}
                            onClick={() => setShowCart(false)}
                          >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {(showCart && cart.length > 0 && !orderCompleted) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setOrderCompleted(false)}
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: theme.colors.primary }}>
              Checkout
            </h2>
            
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={customerDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="specialInstructions" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={customerDetails.specialInstructions}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-medium" style={{ color: theme.colors.primary }}>
                  <p>Total</p>
                  <p>{formatPrice(cartTotal)}</p>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium mt-3" style={{ color: theme.colors.primary }}>
              Order Completed Successfully!
            </h3>
            <div className="mt-2">
              <p className="text-sm" style={{ color: theme.colors.text }}>
                Thank you for your order. We've sent a confirmation to {customerDetails.email}.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white"
                style={{ backgroundColor: theme.colors.primary }}
                onClick={() => {
                  setOrderCompleted(false);
                  setShowCart(false);
                  setCustomerDetails({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    specialInstructions: ''
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

