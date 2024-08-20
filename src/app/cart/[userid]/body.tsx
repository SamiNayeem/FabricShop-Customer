import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/auth-context";

export default function Body() {
  const { authState } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchCartItems();
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/api/cart?userid=${authState.user?.userid}`);
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!authState.isAuthenticated || !authState.user) {
    return <div>Please log in to view your cart.</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <section className="bg-white py-8 antialiased">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.cartDetailId} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <a href="#" className="shrink-0 md:order-1">
                      <img className="h-20 w-20" src={item.imageUrl} alt={item.productName} />
                    </a>
                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900">${item.totalPrice}</p>
                    </div>
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a href="#" className="text-base font-medium text-gray-900 hover:underline">
                        {item.productName}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
